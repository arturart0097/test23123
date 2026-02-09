"use client";
import ReactDOM from "react-dom";
import { X, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

const premiumModels = [
  "gemini-3-pro-preview",
  "gemini-3-flash-preview",
  "claude-sonnet-4-5-20250929",
  "grok-4-0709",
];

export function TierCheck(tier: string, model: string): boolean {
  if (tier === "BASIC") {
    toast.error("Please upgrade your account to PRO to use the Game Builder");
    return false;
  }
  if (tier === "PRO" && premiumModels.includes(model)) {
    toast.error("Please upgrade your account to PREMIUM to advanced models");
    return false;
  }
  return true;
}

export function CreditCheck(credits: number): boolean {
  return credits > 0;
}

interface FeedbackFormProps {
  isOpen: boolean;
  closeModal: () => void;
}

export const TopUpModal = ({ isOpen, closeModal }: FeedbackFormProps) => {
  if (typeof document === "undefined" || !isOpen) return null;

  const root = document.getElementById("root") || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4!">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white/90 p-8! shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-all dark:bg-slate-900/90 dark:ring-white/10">
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full p-1! text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 hover:cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4! flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <ShoppingCart
              className="text-indigo-600 dark:text-indigo-400"
              size={32}
            />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Insufficient Credits
          </h3>
          <p className="mt-2! text-slate-500 dark:text-slate-400">
            You don't have enough credits to perform this action. Top up your
            balance to continue.
          </p>
        </div>
        <div className="mt-8! flex flex-col gap-3!">
          <button
            onClick={() => (window.location.href = "/dashboard/store")}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 active:scale-95 transition-all hover:cursor-pointer"
          >
            Go to Shop
          </button>
          <button
            onClick={closeModal}
            className="w-full rounded-2xl bg-slate-100 px-4 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-300 hover:cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    root,
  );
};
