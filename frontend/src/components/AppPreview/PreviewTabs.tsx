interface PreviewTabProps {
  label: string;
  index: number;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const PreviewTab = ({
  label,
  index,
  activeTab,
  setActiveTab,
}: PreviewTabProps) => {
  const hoverStyling =
    "hover:cursor-pointer hover:border-white hover:bg-[#616783] transition-all duration-300";
  const activeStyling = activeTab === index ? "bg-[#616783] border border-white" : "";
  return (
    <div
      onClick={() => setActiveTab(index)}
      className={`flex justify-center items-center rounded-[14px] px-[36px]! py-[12.5px]! flex-1 ${hoverStyling} ${activeStyling}`}
    >
      {label}
    </div>
  );
};

interface TabRowProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export default function TabRow({ activeTab, setActiveTab }: TabRowProps) {
  return (
    <div
      id="tabs"
      className="flex w-full items-start gap-[8px] rounded-[16px] border border-blue-500/20 bg-gradient-to-b from-[#1A1B1F] to-[#0F1014] p-[8px]!"
    >
      <PreviewTab
        label="Code"
        index={1}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <PreviewTab
        label="Preview"
        index={2}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <PreviewTab
        label="Assets"
        index={3}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <PreviewTab
        label="Integrations"
        index={4}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
