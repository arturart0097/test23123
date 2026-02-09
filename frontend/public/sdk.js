(function (global) {
	'use strict';

	// Helper: base64url -> string -> JSON
	function _b64UrlToB64(input) {
		return input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (input.length % 4)) % 4);
	}
	function _base64Decode(b64) {
		if (typeof atob === 'function') {
			return decodeURIComponent(Array.from(atob(b64)).map(c => {
				const code = c.charCodeAt(0).toString(16).padStart(2, '0');
				return '%' + code;
			}).join(''));
		} else if (typeof Buffer !== 'undefined') {
			return Buffer.from(b64, 'base64').toString('utf8');
		} else {
			throw new Error('No base64 decoder available in this environment.');
		}
	}
	function decodeJWT(token) {
		if (!token || typeof token !== 'string') return null;
		const parts = token.split('.');
		if (parts.length < 2) return null;
		try {
			const payload = JSON.parse(_base64Decode(_b64UrlToB64(parts[1])));
			return payload;
		} catch (e) {
			return null;
		}
	}

	// Helper: safely get prism accessToken
	function _getPrismAccessToken() {
		try {
			if (global.prism && global.prism.accessToken && typeof global.prism.accessToken === 'string') {
				return global.prism.accessToken;
			}
		} catch (e) {
			console.warn('GameGPTSDK: Could not access window.prism.accessToken', e);
		}
		return null;
	}

	// Simple Event Emitter
	function EventEmitter() {
		this._events = Object.create(null);
	}
	EventEmitter.prototype.on = function (evt, fn) {
		if (!this._events[evt]) this._events[evt] = new Set();
		this._events[evt].add(fn);
		return () => this.off(evt, fn);
	};
	EventEmitter.prototype.off = function (evt, fn) {
		if (!this._events[evt]) return;
		if (fn) this._events[evt].delete(fn);
		else delete this._events[evt];
	};
	EventEmitter.prototype.once = function (evt, fn) {
		const wrapper = (...args) => {
			try { fn(...args); } finally { this.off(evt, wrapper); }
		};
		return this.on(evt, wrapper);
	};
	EventEmitter.prototype.emit = function (evt, ...args) {
		const handlers = this._events[evt];
		if (!handlers) return;
		Array.from(handlers).forEach(h => {
			try { h(...args); } catch (err) {
				setTimeout(() => { throw err; }, 0);
			}
		});
	};

	// SDK Class
	function GameGPTSDK(cfg) {
		if (!(this instanceof GameGPTSDK)) return new GameGPTSDK(cfg);
		this.events = new EventEmitter();

		this._config = Object.assign({
			backendEndpoint: 'https://prism-app-backend.vercel.app',
			wagerPath: '/api/tournament_tickets',
			leaderboardPath: '/api/leaderboard',
			defaultWagerAmount: 1,
			autoDecodeToken: true,
			autoFetchPrismToken: true
		}, cfg || {});

		this.version = 0.1;
		this.accessToken = null;
		this.user = { id: null, raw: null, username: null };
		this.isWager = false;
		this._ready = false;

		// Auto-fetch access token from window.prism if available
		if (this._config.autoFetchPrismToken) {
			const prismToken = _getPrismAccessToken();
			if (prismToken) {
				this.setAccessToken(prismToken);
			} else {
				// Set up polling to check for prism token if not immediately available
				this._setupPrismTokenPolling();
			}
		}

		// Auto-initialize with the predefined backend endpoint
		if (this._config.backendEndpoint) {
			this._ready = true;
			setTimeout(() => this.events.emit('ready', { sdk: this }), 0);
		}

		// automatically hook into game_over to post score
		this.events.on('game_over', async ({ score, gameName }) => {
			try {
				await this._postScoreInternal({ score, gameName });
			} catch (e) {
				this.events.emit('error', e);
			}
		});
	}

	// Setup polling for prism token (for when auth loads after SDK)
	GameGPTSDK.prototype._setupPrismTokenPolling = function () {
		const maxAttempts = 50; // 5 seconds total (50 * 100ms)
		let attempts = 0;

		const checkForToken = () => {
			attempts++;
			const prismToken = _getPrismAccessToken();

			if (prismToken) {
				this.setAccessToken(prismToken);
				this.events.emit('token_auto_fetched', { token: prismToken });
				return;
			}

			if (attempts < maxAttempts) {
				setTimeout(checkForToken, 100);
			} else {
				this.events.emit('token_auto_fetch_timeout', { attempts });
			}
		};

		// Start checking after a brief delay to allow auth to initialize
		setTimeout(checkForToken, 100);
	};

	// public: init(config) - now optional since we auto-initialize
	GameGPTSDK.prototype.init = function (config) {
		this._config = Object.assign(this._config, config || {});
		if (!this._config.backendEndpoint) {
			const err = new Error('backendEndpoint is required in config');
			this.events.emit('error', err);
			return this;
		}
		this._ready = true;
		this.events.emit('ready', { sdk: this });
		return this;
	};

	// public: setAccessToken(jwtString)
	GameGPTSDK.prototype.setAccessToken = function (token) {
		this.accessToken = token;
		if (this._config.autoDecodeToken && token) {
			const decoded = decodeJWT(token);
			if (decoded && decoded.sub) {
				this.user.id = decoded.sub;
				this.user.raw = decoded;
				this.user.username = decoded.name || decoded.username || decoded.preferred_username || null;
			} else {
				this.user.raw = decoded;
			}
			this.events.emit('token_updated', { user: this.user, token: token });
		}
		return this;
	};

	// internal fetch helper
	GameGPTSDK.prototype._fetch = async function (url, opts) {
		const headers = Object.assign({ 'Content-Type': 'application/json' }, (opts && opts.headers) || {});
		if (this.accessToken) headers.Authorization = 'Bearer ' + this.accessToken;
		const merged = Object.assign({}, opts, { headers });
		const res = await fetch(url, merged);
		return res;
	};

	// public: initiateWager(amount)
	GameGPTSDK.prototype.initiateWager = async function (amount) {
		if (!this._ready) {
			const err = new Error('SDK not ready. Call init() with backendEndpoint first.');
			this.events.emit('error', err);
			throw err;
		}
		amount = typeof amount === 'number' ? amount : this._config.defaultWagerAmount;
		const userId = this.user && this.user.id;
		if (!userId) {
			const err = new Error('No user id (sub) available on accessToken. Call setAccessToken(jwt) or ensure window.prism.accessToken is available.');
			this.events.emit('error', err);
			throw err;
		}

		const url = `${this._config.backendEndpoint}${this._config.wagerPath}?privyId=${encodeURIComponent(userId)}&amount=${encodeURIComponent(amount)}`;
		try {
			const res = await this._fetch(url, { method: 'DELETE' });
			const prevWager = this.isWager;
			if (res.ok) this.isWager = true;
			else this.isWager = false;

			if (this.isWager !== prevWager) {
				this.events.emit('wager_changed', { isWager: this.isWager });
			}

			return { ok: res.ok, status: res.status };
		} catch (e) {
			this.events.emit('error', e);
			throw e;
		}
	};

	// internal: post score automatically
	GameGPTSDK.prototype._postScoreInternal = async function ({ score, gameName }) {
		const walletId = this.user.id || null;
		const userName = this.user.raw && this.user.raw.name || null;
		const body = { walletId, userName, game: gameName, score, wager: !!this.isWager };
		const url = `${this._config.backendEndpoint}${this._config.leaderboardPath}`;
		try {
			const res = await this._fetch(url, { method: 'POST', body: JSON.stringify(body) });
			const json = await res.json().catch(() => null);
			return { ok: res.ok, status: res.status, response: json };
		} catch (e) {
			this.events.emit('error', e);
			throw e;
		}
	};

	// public: send custom messages
	GameGPTSDK.prototype.sendMessage = function (name, data) {
		if (typeof name === 'object' && name !== null) {
			const obj = name;
			name = obj.name;
			data = obj.data;
		}
		const envelope = { name, data, ts: Date.now() };
		this.events.emit('message', envelope);
		if (name) this.events.emit(name, data);
		return envelope;
	};

	// convenience aliases
	GameGPTSDK.prototype.on = function (evt, fn) { return this.events.on(evt, fn); };
	GameGPTSDK.prototype.off = function (evt, fn) { return this.events.off(evt, fn); };
	GameGPTSDK.prototype.once = function (evt, fn) { return this.events.once(evt, fn); };
	GameGPTSDK.prototype.emit = function (evt, ...args) { return this.events.emit(evt, ...args); };

	// Auto-instantiate and export to global
	if (!global.GameGPTSDK) {
		console.log("Inside SDK: Creating global GameGPTSDK instance");
		// Create auto-initialized instance
		global.GameGPTSDK = GameGPTSDK;
		global.gameGPT = new GameGPTSDK();
	} else {
		console.warn('GameGPTSDK global already exists — not overwriting.');
	}

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
