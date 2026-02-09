/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MessageEnvelope {
  name: string;
  data: any;
  ts: number;
}
interface WagerChangedEvent {
  isWager: boolean;
}

interface ReadyEvent {
  sdk: GameGPTSDK;
}

interface TokenUpdatedEvent {
  token: string;
  user: UserInfo;
}

interface GameOverEvent {
  score: number;
  gameName: string;
}

export interface GameEventTypes {
  ready: ReadyEvent;
  token_updated: TokenUpdatedEvent;
  token_auto_fetched: { token: string };
  token_auto_fetch_timeout: { attempts: number };
  wager_changed: WagerChangedEvent;
  game_over: GameOverEvent;
  game_started: void;
  game_paused: void;
  error: any;
  message: MessageEnvelope;

  // allow arbitrary event names
  [eventName: string]: any;
}

interface GameGPTSDKConfig {
  backendEndpoint?: string;
  wagerPath?: string;
  leaderboardPath?: string;
  defaultWagerAmount?: number;
  autoDecodeToken?: boolean;
  autoFetchPrismToken?: boolean;
}

interface DecodedJWT {
  sub?: string;
  name?: string;
  username?: string;
  preferred_username?: string;
  [key: string]: any;
}

interface UserInfo {
  id: string | null;
  username: string | null;
  raw: DecodedJWT | null;
}

export interface GameGPTSDK {
  // state
  version: 0.1;
  accessToken: string | null;
  user: UserInfo;
  isWager: boolean;

  // config
  init(config?: GameGPTSDKConfig): this;
  setAccessToken(token: string | null): this;

  // features
  initiateWager(amount?: number): Promise<{ ok: boolean; status: number }>;
  sendMessage(
    name: string | { name: string; data: any },
    data?: any
  ): MessageEnvelope;

  // event system
  on<K extends keyof GameEventTypes>(
    evt: K,
    fn: (payload: GameEventTypes[K]) => void
  ): () => void;

  off<K extends keyof GameEventTypes>(
    evt: K,
    fn?: (payload: GameEventTypes[K]) => void
  ): void;

  once<K extends keyof GameEventTypes>(
    evt: K,
    fn: (payload: GameEventTypes[K]) => void
  ): () => void;

  emit<K extends keyof GameEventTypes>(
    evt: K,
    payload: GameEventTypes[K]
  ): void;
}
