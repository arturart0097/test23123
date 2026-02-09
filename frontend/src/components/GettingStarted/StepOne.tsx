import { useEffect, useRef, useState } from "react";
import { MODEL_CONFIGS } from "../../contexts/Types";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { useTutorial } from "../../hooks/useTutorial";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "../Button";

export interface StepProps {
  step: number;
  setStep?: (step: number) => void;
}

export default function StepOne({ step, setStep }: StepProps) {
  const gb = useGameBuilder();
  const [promptDraft, setPromptDraft] = useState(gb.currentGamePrompt ?? "");
  const [titleInteracted, setTitleInteracted] = useState(false);
  const [modelInteracted, setModelInteracted] = useState(false);
  const [promptInteracted, setPromptInteracted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("GEMINI_2_FLASH");
  const [selectedLabel, setSelectedLabel] = useState("Gemini");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "GEMINI_2_FLASH", label: "Gemini 2 Flash" },
    { value: "GEMINI_2_PRO", label: "Gemini 2 Pro" },
    { value: "GEMINI_3_FLASH", label: "Gemini 3 Flash" },
    { value: "GEMINI_3_PRO", label: "Gemini 3 Pro" },
    { value: "CLAUDE_3", label: "Claude 3" },
    { value: "CLAUDE_4", label: "Claude 4" },
    { value: "GROK_FAST", label: "Grok Fast" },
    { value: "GROK_PRO", label: "Grok Pro" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    setIsOpen(false);

    const config = MODEL_CONFIGS[value];
    if (config) {
      gb.setGameLLM(config.llm);
      gb.setGameModel(config.model);
      setModelInteracted(true);
    }
  };

  const active = step === 1;

  const { step: currentStep, advanceStep, tutorial } = useTutorial();

  const UpgradePrompt = async () => {
    await gb.enhanceGamePrompt(promptDraft);
    setStep?.(2);
  };

  return active ? (
    <div className="flex flex-col w-full h-[75vh] gap-6 p-2! px-[32.6px]! pt-[32.6px]!">
      <div className="flex flex-col gap-3">
        <div>Name Your Game!</div>
        <div className="flex w-full justify-between">
          <input
            className={`theme-field w-full ${!tutorial && currentStep === 3 && !titleInteracted
              ? "ring-2 !ring-fuchsia-400/70 !shadow-[0_0_28px_rgba(217,70,239,0.55)] animate-pulse"
              : ""
              }`}
            type="text"
            placeholder="Game Title"
            value={gb.gameName}
            onChange={(e) => {
              setTitleInteracted(true);
              gb.setGameName(e.target.value);
            }}
          />
        </div>
      </div>

      <PanelGroup direction="vertical">
        <Panel
          minSize={25}
          defaultSize={50}
          maxSize={90}
          className="flex flex-col w-full"
        >
          <form className="form-container flex flex-col w-full text-left gap-4">
            <p>
              Write your game idea, we'll create a full game plan for you to
              approve
            </p>

            <textarea
              className={`theme-textarea flex w-full h-full p-2!`}
              placeholder="Describe your game…"
              rows={40}
              onChange={(e) => {
                e.preventDefault();
                setPromptInteracted(true);
                setPromptDraft(e.target.value);
              }}
              value={promptDraft}
            ></textarea>
          </form>
        </Panel>
        <PanelResizeHandle className="h-1.5 bg-zinc-700/60 hover:bg-pink-300/40 cursor-col-resize rounded transition-colors duration-100" />
        <Panel className="flex flex-col justify-center items-center w-full gap-5">
          <div ref={dropdownRef} className="relative w-full">
            {/* Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center rounded-[14px] pl-[45%]! px-[24px]! py-[10.5px]! border border-white bg-gradient-to-b from-[#057DFF] to-[#0284C7] text-white font-medium"
            >
              <p>{selectedLabel}</p>
              <svg
                className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-[#333] rounded-[14px] shadow-xl">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value, option.label)}
                    className={`w-full text-left px-[24px]! py-[12px]! text-white hover:bg-[#2a2a2a] transition-colors ${selectedValue === option.value ? 'bg-[#2a2a2a]' : ''
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            className={`w-full`}
            type="button"
            onClick={async () => {
              await UpgradePrompt();
              if (currentStep === 3) {
                advanceStep();
              }
            }}
          >
            Enhance
          </Button>
        </Panel>
      </PanelGroup>
    </div>
  ) : null;
}
