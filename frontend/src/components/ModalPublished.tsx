import { CircleQuestionMark } from "lucide-react";
import { Button } from "./Button";

const MOCK_USER = {
  name: "Aria Pixel",
  avatar: "https://i.pravatar.cc/240?img=12",
  description:
    "Indie game maker. Building neon worlds, playful loops, and cozy arcade vibes.",
  wallet: "0xA1B2...9F0C",
};

export const ModalPublished = ({
  setShowModalPublished,
  onUpdateProfile,
}: {
  setShowModalPublished: (bool: boolean) => void;
  onUpdateProfile?: () => void;
}) => {

  if (!setShowModalPublished) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-100" />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4">
        <div className="relative w-full max-w-3xl">
          <div
            className="absolute -inset-[2px] rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-b from-[#1A1B2E] via-[#16172A] to-[#1A1B2E] shadow-2xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/70 text-white shadow-[0_20px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/10 to-indigo-500/20 blur-3xl" />
            <div className="relative flex flex-col !gap-6 !p-8 sm:!p-10">
              <div className="flex items-center !gap-4">
                <div className="flex items-center !p-3 justify-center rounded-2xl bg-gradient-to-b from-[#F094FA] to-[#6760FF] text-white shadow-lg shadow-fuchsia-500/20">
                  <CircleQuestionMark width={32} height={32} />
                </div>
                <div>
                  <p className="text-sm text-white/70">Game Published</p>
                  <span className="text-2xl font-semibold leading-tight">
                    Thanks for publishing the game, here is the info that will
                    be visible for everyone , do you want to update your prism
                    profile?
                  </span>
                </div>
              </div>

              <div className="!gap-4 rounded-2xl border border-white/5 bg-white/5 !p-4 sm:!p-6">
                <div className="flex items-start !gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/60 to-indigo-900/60">
                    <img
                      src={MOCK_USER.avatar}
                      alt={`${MOCK_USER.name} avatar`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="!space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] text-white/60">
                        Creator
                      </p>
                      <p className="text-xl font-semibold">{MOCK_USER.name}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-white/75">
                      {MOCK_USER.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col !gap-3 rounded-xl border border-white/5 bg-white/5 !p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.08em] text-white/60">
                    Wallet
                  </p>
                </div>
                <p className="text-lg font-mono text-white/90">
                  {MOCK_USER.wallet}
                </p>
                <div className="flex items-center !gap-2 text-sm text-white/70">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_0_4px_rgba(52,211,153,0.1)]" />
                  <span>Profile looks healthy and ready for players.</span>
                </div>
              </div>

              <div className="flex !gap-3">
                <Button
                  className="flex-1 uppercase"
                  onClick={() => {
                    setShowModalPublished(false);
                    onUpdateProfile?.();
                  }}
                >
                  Update Profile
                </Button>
                <button
                  className="white-black-btn w-full sm:w-auto flex-1"
                  onClick={() => setShowModalPublished(false)}
                >
                  Published Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
