"use client";
import { ThemeButton } from "../Buttons";
import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepFour from "./StepIntegration";

interface StepProps {
  step: number;
  activeStep: number;
}

const StepPill = ({ step, activeStep }: StepProps) => {
  const active = step === activeStep;
  const bgStyle = active ? "bg-pink-500" : "bg-slate-600";
  return <div className={`flex rounded-full h-2 w-10 ${bgStyle}`}></div>;
};

interface NavProps {
  step: number;
  setStep?: (step: number) => void;
}

const StepNav = ({ step, setStep }: NavProps) => {
  const Navigate = (stepCount: number) => {
    const newStep = (step += stepCount);
    if (newStep > 3 || newStep < 1) return;
    setStep(newStep);
  };

  const active = `flex justify-center items-start gap-[7.75px] rounded-[14px] px-[20px] py-[10px] bg-[linear-gradient(60deg,#F094FA_13.4%,#F5576E_86.6%)] cursor-pointer`;
  const inactive = "flex justify-center items-start gap-[8px] rounded-[10px] border border-white/10 bg-white/5 px-[24.6px] py-[12.6px] cursor-not-allowed";
  const leftStyle = step > 1 ? active : inactive;
  const rightStyle = step < 3 ? active : inactive;

  return (
    <div className="flex fixed bottom-12 inset-x-0 z-50 justify-between items-center px-[32.6px]!">
      <div className={`${leftStyle}`}>
        <ThemeButton
          hover="hover:cursor-default"
          padding="py-2! px-4!"
          onClick={() => Navigate(-1)}
        >
          &lt; Previous Step
        </ThemeButton>
      </div>

      <div className="flex items-center justify-center gap-1">
        <span>Step  {step} of 3</span>
      </div>

      {step < 3 && <div className={`relative ${rightStyle}`}>
        <ThemeButton
          hover="null"
          padding="py-2! px-4!"
          onClick={() => {
            Navigate(1);
          }}
        >
          Next Step &gt;
        </ThemeButton>
      </div>}

      {step === 3 && <div className={`relative ${active}`}>
        <ThemeButton
          hover="null"
          padding="py-2! px-4!"
          onClick={() => {
            Navigate(1);
          }}
        >
          Publish
        </ThemeButton>
      </div>}
    </div>
  );
};

export default function Steps() {
  const [step, setStep] = useState<number>(1);
  return (
    <div className="flex relative flex-col w-full justify-between overflow-y-auto!">
      <div className="flex relative flex-col w-full justify-between [font-family:'Tachyon_W00_Light'] overflow-y-auto!">
        <StepOne step={step} setStep={setStep} />
        <StepTwo step={step} />
        <StepFour step={step} />
      </div>
      <StepNav step={step} setStep={setStep} />
    </div>
  );
}