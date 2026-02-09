import trophyIcon from "../assets/trophy.svg";

export const Rating = () => {
  const score = 137;
  const topPercent = 20;

  return (
    <div className="flex gap-6 items-center w-[100%]">
      {/* Developer Rating Card */}
      <div
        className="relative flex-1 rounded-[16px] p-[1px]"
      >
        <div 
          className="w-full h-full rounded-[15px] p-6"
          style={{
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <img
                src={trophyIcon}
                alt="Trophy"
                className="w-14 h-14 object-contain"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(77%) sepia(95%) saturate(1352%) hue-rotate(1deg) brightness(105%) contrast(105%)",
                }}
              />
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  Developer rating = total score based on how users interact
                  with the platform.
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Your score is {score}, you are in the top {topPercent}%!
                </p>
              </div>
            </div>
          </div>
          <div className="w-[60%] h-[0px] shadow-[60px_20px_10px_5px_rgba(59,103,229,0.55)] rounded-xxl"></div>
        </div>
      </div>

      {/* Circular Progress Indicator */}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--border-primary)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - topPercent / 100)}`}
              style={{
                filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))",
              }}
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#9333EA" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-light" style={{ color: "var(--text-primary)" }}>
              {topPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
