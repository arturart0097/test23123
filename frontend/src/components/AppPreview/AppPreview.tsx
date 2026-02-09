import { DownloadButton, EditorPane, RefreshButton } from './CodeEditor'

import AssetsTab from './AssetsTab'
import { ChatBoxFloat } from '../Chat'
import EventGeneratorTab from './EventGeneratorTab'
import GamePreview from './GamePreview'
import SDKTab from './SDKTab'
import TabRow from './PreviewTabs'
import { useGameBuilder } from '../../contexts/GameBuilderContext'
import { useState } from 'react'
import { useTutorial } from '../../hooks/useTutorial'

export function stripHtmlCodeTags(code: string): string {
  return code
    .replace(/^(`{3,}|'{3,})\s*html\s*\n?/, '')
    .replace(/(`{3,}|'{3,})\s*$/, '')
    .trim()
}

function AppPreview() {
  const [activeTab, setActiveTab] = useState<number>(1)
  const { gameCode, setGameCode, createGameStream, gameId } = useGameBuilder()

  const reactiveStyle =
    'w-full! md:w-full! max-w-full! md:max-w-180! pl-3! py-1!'

  return (
    <>
      <div
        id="app-preview"
        className={`flex flex-col h-auto items-center relative`}>
        <TabRow activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 2 ? (
          <GamePreview />
        ) : activeTab == 1 ? (
          <div className="flex flex-col items-center w-full gap-3 mt-3! border border-[#057DFF33] rounded-[16px]">
            <EditorPane
              gameCode={stripHtmlCodeTags(gameCode)}
              setGameCode={setGameCode}
            />

            <div className="flex h-[74px] gap-3 justify-end items-center shrink-0 self-stretch px-[16px]! border-t border-blue-500/20 bg-black/10">
              <DownloadButton gameCode={gameCode} />
              <RefreshButton
                createGameStream={createGameStream}
                gameCode={gameCode}
              />
            </div>

            {/* <ChatBoxFloat gameId={gameId} setGameCode={setGameCode} /> */}
          </div>
        ) : activeTab == 3 ? (
          <div className='w-full h-full bg-[#FFFFFF0D] rounded-[16px] mt-2! border border-blue-500/20'>
            <AssetsTab />
          </div>
        ) : activeTab == 4 ? (
          <>
            <SDKTab gameCode={gameCode} setGameCode={setGameCode} />
            {/* <EventGeneratorTab gameCode={gameCode} setGameCode={setGameCode} /> */}
          </>
        ) : null}
      </div>
    </>
  )
}

export default AppPreview
