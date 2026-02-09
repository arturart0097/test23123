// import { useEffect } from "react";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { CheckCircle, Crown, Rocket, Star, ArrowRight } from "lucide-react"; // Optional: Lucide icons

const StoreSuccessPage = () => {
  const { tokenBalance, userTier } = useGameBuilder();

  // useEffect(() => {
  //   initializeUser();
  // }, []);

  const tierConfig = {
    BASIC: {
      color: "text-blue-400",
      bg: "from-blue-500/20",
      icon: <Star className="w-8 h-8 text-blue-400" />,
    },
    PREMIUM: {
      color: "text-purple-400",
      bg: "from-purple-500/20",
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
    },
    PRO: {
      color: "text-amber-400",
      bg: "from-amber-500/20",
      icon: <Crown className="w-8 h-8 text-amber-400" />,
    },
  };

  const currentTier =
    tierConfig[userTier as keyof typeof tierConfig] || tierConfig.BASIC;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r ${currentTier.bg} to-transparent blur-[120px] opacity-50`}
      />

      <div className="relative z-10 w-full max-w-md p-8! mx-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
            <CheckCircle className="w-20 h-20 text-green-500 relative z-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
              Payment Success
            </h1>
            <p className="text-gray-400 font-medium">
              Your account has been upgraded
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-4! rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                Tier Status
              </span>
              <div className="flex items-center gap-2">
                {currentTier.icon}
                <span className={`text-xl font-bold ${currentTier.color}`}>
                  {userTier}
                </span>
              </div>
            </div>

            <div className="p-4! rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                New Balance
              </span>
              <span className="text-2xl font-bold text-white leading-none">
                {tokenBalance}{" "}
                <span className="text-xs text-gray-400">Tokens</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="group mt-4 w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSuccessPage;
