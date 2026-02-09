import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { useEffect, useState } from "react";
import type { StepProps } from "./StepOne";
import { useTutorial } from "../../hooks/useTutorial";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { ButtonBlue } from "../ButtonBlue";
import { Button } from "../Button";

export default function StepTwo({ step }: StepProps) {
  const gb = useGameBuilder();
  const [localPrompt, setLocalPrompt] = useState<string>(gb.currentGamePrompt);
  const [isTypingPrompt, setIsTypingPrompt] = useState(false);
  const active = step === 2;
  const { tutorial, step: tutorialStep, advanceStep } = useTutorial();
  const [advanceRecordedStep5, setAdvanceRecordedStep5] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      return window.localStorage.getItem("tutorialStep5Advanced") === "true";
    }
  );
  const [advanceRecorded, setAdvanceRecorded] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("tutorialStep4Advanced") === "true";
  });

  useEffect(() => {
    if (!isTypingPrompt && gb.currentGamePrompt !== localPrompt) {
      setLocalPrompt(gb.currentGamePrompt);
    }
  }, [gb.currentGamePrompt, isTypingPrompt, localPrompt]);

  useEffect(() => {
    // Reset local flag if user is not on step 4 anymore
    if (tutorialStep !== 6 && advanceRecorded) {
      setAdvanceRecorded(false);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("tutorialStep4Advanced");
      }
    }
    // Show overlay immediately if StepOne signaled it
    if (!tutorial && tutorialStep === 6 && typeof window !== "undefined") {
      const pending = window.localStorage.getItem("pendingStep4Overlay");
      if (pending === "true") {
        // Clear the flag and trigger a render
        window.localStorage.removeItem("pendingStep4Overlay");
        setAdvanceRecorded((v) => v);
      }
    }
  }, [tutorial, tutorialStep, advanceRecorded]);

  // Fallback: if we arrive at StepTwo with a pending flag but step hasn't advanced yet, advance now
  useEffect(() => {
    if (!tutorial && typeof window !== "undefined") {
      const pending = window.localStorage.getItem("pendingStep4Overlay");
      if (pending === "true" && tutorialStep < 6) {
        advanceStep();
      }
    }
  }, [tutorial, tutorialStep, advanceStep]);

  const ButtonClick = () => {
    gb.createGameStream().then(() => { });
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) {
        const el = document.getElementById("app-preview");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return active ? (
    <div className="flex flex-col w-full h-[75vh] rounded-xl relative">
      <PanelGroup direction="vertical">
        <Panel
          minSize={65}
          defaultSize={50}
          maxSize={96}
          className="flex flex-col w-full"
        >
          <form className="flex flex-col gap-4 w-full">
            <div className="flex flex-col items-start gap-[4px] shrink-0 self-stretch border-b border-white/10 bg-white/5 px-[24px]! pt-[24px]! pb-[0.6px]!">
              <p className="mb-1!">
                Here's your game plan! See anything you would change? Go ahead.
                When you're ready press "Generate Game"
              </p>
            </div>

            <textarea
              className="input-field h-[336px]! w-full p-5! text-[14px] rounded-xl focus:ring-2 focus:ring-fuchsia-300/40 focus:border-transparent"
              rows={30}
              placeholder={gb.currentGamePrompt}
              onFocus={() => setIsTypingPrompt(true)}
              onBlur={() => setIsTypingPrompt(false)}
              onChange={(e) => {
                e.preventDefault();
                setLocalPrompt(e.target.value);
                gb.setGamePrompt(e.target.value);
              }}
              value={localPrompt}
              style={{
                border: "none",
                background: "none"
              }}
            ></textarea>

            <div
              className={`${!tutorial && tutorialStep === 7 ? "relative z-20" : ""}`}
            ></div>
          </form>
        </Panel>
        <PanelResizeHandle className="h-1.5 bg-zinc-700/60 hover:bg-pink-300/40 cursor-col-resize rounded transition-colors duration-100" />
        <Panel>
          <div className="flex flex-col items-center justify-center mt-5! gap-5 px-[32px]!">
            <ButtonBlue
              onClick={() => {
                if (!advanceRecorded && !tutorial && tutorialStep === 7) {
                  advanceStep();
                  setAdvanceRecorded(true);
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      "tutorialStep4Advanced",
                      "true"
                    );
                  }
                }
                ButtonClick();
              }}
              type="button"
              className="bg-[#6760FF]"
            >
              Generate Game
            </ButtonBlue>

            {gb.isFetching || !gb.gameCode ? null : (
              <div className="flex flex-col items-center text-center justify-center gap-5 w-full">
                <Button
                  disabled={gb.isFetching || !gb.gameCode}
                  type="button"
                  className={`w-full`}
                  onClick={async () => {
                    if (
                      !advanceRecordedStep5 &&
                      !tutorial &&
                      tutorialStep === 9
                    ) {
                      setAdvanceRecordedStep5(true);
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem(
                          "tutorialStep5Advanced",
                          "true"
                        );
                      }
                      advanceStep();
                    }
                    await gb.saveGame();
                    if (typeof window !== "undefined") {
                      // Signal GameListing to show the congratulatory modal once
                      window.localStorage.setItem("onboardingCongrats", "1");
                    }
                    // navigate("/dashboard/games");
                  }}
                >
                  Save Game
                </Button>
              </div>
            )}

            {!tutorial &&
              (tutorialStep === 7 ||
                tutorialStep === 7 ||
                (tutorialStep === 8 && gb.gameCode && !gb.isFetching)) && (
                <>
                  <div
                    className="absolute bottom-[35%] z-99 left-[50%] flex gap-4"
                    style={{
                      transform: `translate(-50%, 0px)`,
                    }}
                  >
                    <div className="flex flex-col justify-center -top-12 relative !p-4 rounded-xl shadow-2xl max-w-100 text-white bg-black/60 backdrop-blur-md border border-gray-400/50">
                      <div className="text-md leading-snug">
                        <span
                          className="ml-1"
                          style={{
                            fontFamily: "Bicyclette",
                          }}
                        >
                          Click here and GameGPT will start making your idea
                          come true!
                        </span>
                      </div>
                      <svg
                        className="absolute left-1/2 -translate-x-1/2 -top-5 w-7 h-7"
                        viewBox="0 0 24 12"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 0 C10 4 6 8 3 10 L21 10 C18 8 14 4 12 0 Z"
                          fill="rgba(0,0,0,0.6)"
                          stroke="rgba(156,163,175,0.6)"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              )}

            {!tutorial &&
              tutorialStep === 9 &&
              gb.gameCode &&
              !gb.isFetching && (
                <>
                  <div
                    className="absolute bottom-[16%] z-99 right-auto flex gap-4"
                    style={{
                      transform: `translate(0%, 0px)`,
                    }}
                  >
                    <div className="flex flex-col justify-center -top-12 relative !p-4 rounded-xl shadow-2xl max-w-100 text-white bg-black/60 backdrop-blur-md border border-gray-400/50">
                      <div className="text-md leading-snug">
                        <span
                          className="ml-1"
                          style={{
                            fontFamily: "Bicyclette",
                          }}
                        >
                          Click here button to save the game
                        </span>
                      </div>
                      <svg
                        className="absolute left-1/2 -translate-x-1/2 -top-5 w-7 h-7"
                        viewBox="0 0 24 12"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 0 C10 4 6 8 3 10 L21 10 C18 8 14 4 12 0 Z"
                          fill="rgba(0,0,0,0.6)"
                          stroke="rgba(156,163,175,0.6)"
                          strokeWidth="1"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  ) : null;
}
