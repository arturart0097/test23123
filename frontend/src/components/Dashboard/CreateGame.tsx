import AppPreview from "../AppPreview/AppPreview";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Steps from "../GettingStarted/Steps";
import { useTutorial } from "../../hooks/useTutorial";
import Chat, { ChatBoxFloat } from "../Chat";

export default function CreateGame() {
  const { gameId } = useGameBuilder();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        <h1>
          Create Game
        </h1>
        <span>Build your game with AI assistance</span>
      </div>
      {/* Mobile layout: stack Steps above AppPreview */}
      <div className="flex md:hidden w-full flex-col gap-3">
        <Steps />
        <AppPreview />
      </div>

      {/* Desktop/tablet layout: horizontal resizable panels */}
      <div className="hidden md:flex w-full">
        <div className="flex w-full gap-7">
          <div className="flex w-[40%] min:h-[768px] flex-col items-start gap-9 shrink-0 self-stretch rounded-[16px] border border-blue-500/20 bg-gradient-to-b from-[#1A1B1F] to-[#0F1014]">
            <Steps />
          </div>
          {/* <PanelResizeHandle className="w-1.5 bg-zinc-700/60 hover:bg-pink-300/40 cursor-col-resize rounded transition-colors duration-100" /> */}
          <div className="w-full">
            <AppPreview />
          </div>
        </div>
      </div>
      <div className="mt-5! mb-30!">
        <ChatBoxFloat gameId={gameId} setGameCode={() => {}} />
      </div>
    </div>
  );
}
