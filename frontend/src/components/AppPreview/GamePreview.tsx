import '../../sass/AppPreview.scss'
import '../../sass/AppPreview.scss'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import '../../sass/AppPreview.scss'
import { type GameGPTSDK } from '../../lib/sdkClient'
import '../../sass/AppPreview.scss'
import qr_icon from '../../assets/qr_code.svg'
import reload_icon from '../../assets/reload.svg'
import { useGameBuilder } from '../../contexts/GameBuilderContext'
import { getAccessToken } from '@privy-io/react-auth'
import sdkCode from '/src/assets/sdk.js?raw'
import { stripHtmlCodeTags } from './AppPreview'
import QRCode from 'react-qr-code'

interface GameFrameWindow extends Window {
  gameGPT: GameGPTSDK;
  ASSETS: Record<string, HTMLImageElement>;
  ASSET_KEYS: string[];
  ASSETS_LOADED: boolean;
}

export default function GamePreview() {
  const {
    gameId,
    gameCode,
    gameAssetMap,
    setGameAssetMap,
    gameSDKChecklist,
    saveSDKVersion,
    setGameSDKChecklist,
    sdkVersion,
    setAssetLoading,
  } = useGameBuilder()
  const [iframeKey, setIFrameKey] = useState(0)
  const [activePage, setActivePage] = useState('preview')
  const gameIFrameRef = useRef<HTMLIFrameElement>(null)
  const sdkLoaded = useRef(false)
  const gameLink = `${window.location.origin}/gametest/${gameId}`

  const onGameWindowReload = () => {
    sdkLoaded.current = false;
    setIFrameKey((prev) => prev + 1);
  };

  const processAssetFiles = async (
    files: Record<string, File | string>
  ): Promise<void> => {
    const iframeWindow = gameIFrameRef.current
      ?.contentWindow as GameFrameWindow | null;
    if (!iframeWindow) return;

    console.log('Processing asset files (with onload)')
    setAssetLoading(true)

    const entries = await Promise.all(
      Object.entries(files).map(
        ([key, image]) =>
          new Promise<[string, HTMLImageElement | null]>((resolve) => {
            if (!image) {
              console.log(`Skipping ${key} - no image`);
              resolve([key, null]);
              return;
            }

            const img = new (iframeWindow as any).Image();

            img.onload = () => {
              console.log(`Loaded image: ${key}`);
              resolve([key, img]);
            };

            img.onerror = (err) => {
              console.warn(`Failed to load image: ${key}`, err);
              resolve([key, null]); // don't blow up everything for one bad asset
            };

            if (typeof image === 'string') {
              img.src = image
            } else {
              img.src = URL.createObjectURL(image);
            }
          })
      )
    );

    iframeWindow.ASSETS = {};
    for (const [key, img] of entries) {
      if (img) {
        iframeWindow.ASSETS[key] = img;
      }
    }

    iframeWindow.ASSETS_LOADED = true
    setAssetLoading(false)
    iframeWindow.dispatchEvent(new Event('assets-ready'))
    console.log('🎨 All assets loaded & assets-ready dispatched')
  }

  useEffect(() => {
    if (gameIFrameRef.current) {
      const IFrameWindow = gameIFrameRef.current
        .contentWindow as GameFrameWindow;

      IFrameWindow.ASSETS = {};
      IFrameWindow.ASSETS_LOADED = false;

      sdkLoaded.current = true;
    }

    const handleIframeLoad = async () => {
      const IFrameWindow = gameIFrameRef.current!
        .contentWindow as GameFrameWindow
      const IFrameDocument = gameIFrameRef.current!.contentDocument!
      if (IFrameDocument.readyState !== 'complete') return

      console.log('Iframe loaded, processing assets...')
      await processAssetFiles(gameAssetMap)

      if (IFrameWindow.ASSET_KEYS) {
        const contextKeys = Object.keys(gameAssetMap);
        if (
          JSON.stringify(IFrameWindow.ASSET_KEYS) !==
          JSON.stringify(contextKeys)
        ) {
          console.log('Updating asset keys')
          const newAssetMap: Record<string, File | string> = {}
          IFrameWindow.ASSET_KEYS.forEach((key) => {
            if (gameAssetMap[key]) {
              newAssetMap[key] = gameAssetMap[key];
            } else {
              newAssetMap[key] = null;
            }
          });
          setGameAssetMap(newAssetMap);
        }
      }

      const sdk = IFrameWindow.gameGPT;

      if (!sdk) {
        setGameSDKChecklist((prev) => ({
          ...prev,
          ready: {
            ...prev.ready,
            completed: false,
            message: 'SDK Ready Event not triggered yet.',
          },
        }))
        console.warn('SDK not loaded yet in iframe')
        return
      } else {
        setGameSDKChecklist((prev) => ({
          ...prev,
          ready: {
            ...prev.ready,
            completed: true,
            message: 'Received Ready Event',
          },
        }));
      }

      sdk.on('message', (data) => {
        console.log("SDK 'message' event received:", data)
        if (data.name == 'game_start') {
          setGameSDKChecklist((prev) => ({
            ...prev,
            start: {
              ...prev.start,
              completed: true,
              message: `Game Started`,
            },
          }));
        }
      });

      sdk.on('game_over', (data) => {
        console.log("SDK 'game_over' event received:", data)
        setGameSDKChecklist((prev) => ({
          ...prev,
          over: {
            completed: true,
            message: `Received Score: ${data.score}`,
          },
        }));
      });

      // Static check for quests integration
      if (gameCode.includes("window.gameGPT.emit('quest_completed',") || gameCode.includes('window.gameGPT.emit("quest_completed",')) {
        setGameSDKChecklist((prev) => ({
          ...prev,
          quests: {
            ...prev.quests,
            completed: true,
            message: `Quests integration detected`,
          },
        }));
      }

      // sdk.on("wager_changed", (data) => {
      //   console.log("SDK 'wager_changed' event received:", data)
      //   setGameSDKChecklist((prev) => ({
      //     ...prev,
      //     wager: {
      //       ...prev.wager,
      //       completed: true,
      //       message: `Received Wager Event ${data.isWager ? "(Wager Mode)" : "(Free Mode)"}`,
      //     },
      //   }))
      // })

      // Send Wager mode call manually because this will be handled by the unified platform anyway
      const accessToken = await getAccessToken();
      sdk.setAccessToken(accessToken);

      if (sdk.initiateWager) {
        setGameSDKChecklist((prev) => ({
          ...prev,
          wager: {
            ...prev.wager,
            completed: true,
            message: `Wager mode integrated`,
          },
        }));
      }
      sdk.initiateWager(1);
    };

    gameIFrameRef.current?.addEventListener('load', handleIframeLoad)

    return () => {
      sdkLoaded.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIFrameRef, iframeKey]);

  useEffect(() => {
    if (sdkVersion > 0) return; // already saved

    if (
      gameSDKChecklist.ready.completed &&
      gameSDKChecklist.start.completed &&
      gameSDKChecklist.over.completed &&
      gameSDKChecklist.wager.completed
    ) {
      const IFrameWindow = gameIFrameRef.current!
        .contentWindow as GameFrameWindow
      const IFrameDocument = gameIFrameRef.current!.contentDocument!
      if (IFrameDocument.readyState !== 'complete') return

      const sdk = IFrameWindow.gameGPT
      if (sdk) {
        saveSDKVersion(sdk.version);
      }
    }
  }, [gameSDKChecklist, sdkVersion, saveSDKVersion]);

  return (
    <div className="flex flex-col w-full items-center max-h-144 mt-3!">
      <div className="flex status-bar w-full justify-between h-12!">
        <div
          className="cursor-pointer action-btn h-8! justify-center! items-center"
          onClick={() => setActivePage('mobileQR')}
        >
          <img src={qr_icon} />
          Mobile
        </div>
        <div
          className="cursor-pointer title"
          onClick={() => setActivePage('preview')}
        >
          <div>GameGPT</div>
          <div>Mini App</div>
        </div>
        <a
          href="#"
          className="action-btn  h-8! justify-center! items-center"
          onClick={onGameWindowReload}
        >
          <img src={reload_icon} />
          Reload
        </a>
      </div>

      <div className={`flex w-full h-screen`}>
        {activePage === 'mobileQR' ? (
          <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="text-2xl! mb-3!">Scan QR Code to Play</div>
            <div className='w-1/3'>
              <QRCode
                size={128}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={gameLink}
                viewBox={`0 0 256 256`}
              />
              <a href={gameLink} target='_blank' className='text-center text-xs'>{gameLink}</a>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            id="gameCanvas"
            ref={gameIFrameRef}
            srcDoc={`<script>${sdkCode}</script>${stripHtmlCodeTags(gameCode)}`}
            className="flex w-full! h-140"
            sandbox="allow-scripts allow-same-origin"
            title="Game Preview"
          />
        )}
      </div>
    </div>
  );
}
