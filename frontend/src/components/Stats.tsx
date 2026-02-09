import { Tag } from "./ProfileCard";

const stats = [
  {
    value: "12",
    label: "Games started",
  },
  {
    value: "8 243",
    label: "Written lines of code",
  },
  {
    value: "197",
    label: "Developer rating",
    tag: {
      text: "TOP • 20",
      color: "violet",
    },
  },
  {
    value: "Gold Pack",
    label: "5000 CREDITS",
    sublabel: "Plan",
    highlight: true,
  },
];

export const Stats = () => {
  return (
    <div
      className="flex gap-10 w-full justify-center"
      style={{
        margin: "100px auto",
      }}
    >
      <div className="flex gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`relative flex flex-col justify-center items-center w-[276px] h-[212px] px-[24px] py-[16px] gap-[12px] rounded-[16px] backdrop-blur-[50px] ${
              item.highlight ? "" : "border"
            }`}
            style={{
              backgroundColor: item.highlight 
                ? "transparent" 
                : "var(--bg-card)",
              borderColor: item.highlight 
                ? "transparent" 
                : "var(--border-primary)",
              boxShadow: item.highlight
                ? "0 10px 85px -5px rgba(255, 215, 0, 0.3), 0 4px 6px -2px rgba(255, 215, 0, 0.2)"
                : "0 10px 85px -5px rgba(59, 130, 246, 0.5), 0 4px 6px -2px rgba(147, 51, 234, 0.3)",
            }}
          >
            {item.highlight && (
              <div
                className="absolute inset-0 rounded-[16px] -z-10"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(135deg,rgba(255, 217, 0, 0.6),rgba(255, 229, 181, 0),rgba(255, 217, 0, 0.4))",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFD700, #FFA500, #FFD700)",
                  }}
                />
              </div>
            )}
            <div className="font-light text-3xl" style={{ color: "var(--text-primary)" }}>{item.value}</div>

            {item.tag && (
              <div className="flex items-center justify-center text-[10px] px-2 py-[2px] rounded-full border" style={{ 
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-secondary)"
              }}>
                <Tag title={"TOP-20"} color="violet" />
              </div>
            )}

            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.label}</div>

            {item.sublabel && (
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.sublabel}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
