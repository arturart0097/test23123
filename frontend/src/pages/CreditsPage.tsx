import { useNavigate } from "react-router";
import CreditsTable from "../components/CreditsTable";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

const balanceIcon = <CircleDollarSign color="#057DFF" />
const trafficIcon = <TrendingUp color="#F094FA" />
const chartDown = <TrendingDown color="#6760FF" />

export const statsCards = [
  {
    id: "current-balance",
    title: "Current balance",
    value: 800,
    valueSuffix: "",
    subtitle: "100% of 800 credits",
    progress: 100,
    icon: balanceIcon, // $
    accent: "bg-[#057DFF1A]",
    textColor: "text-[#057DFF]"
  },
  {
    id: "total-earned",
    title: "Total earned",
    value: 1650,
    valuePrefix: "+",
    subtitle: "↗ From purchases & bonuses",
    icon: trafficIcon, // ↗
    accent: "bg-[#F094FA1A]",
    textColor: "text-[#F094FA]"
  },
  {
    id: "total-spent",
    title: "Total spent",
    value: 500,
    valueSuffix: "",
    subtitle: "↘ On game generation",
    icon: chartDown, // ↘
    accent: "bg-[#6760FF1A]",
    textColor: "text-[#6760FF]"
  },
];


export const CreditsPage = () => {

  return (
    <div className="flex flex-col justify-center w-full p-4!">
      <h1>My credits</h1>
      <span>Manage your credits and view transaction history</span>
      <div className="flex items-center justify-center gap-10! mt-5!">
        {statsCards.map(el => (
          <div className="flex-1 h-[153.156px] shrink-0 p-5! rounded-[16px] border-[0.599px] border-[rgba(5,125,255,0.2)] bg-white/5">
            <div className="w-full text-right uppercase"><span>{el.title}</span></div>
            <div className="flex justify-between items-center">
              <div className={`flex w-[47.995px] h-[47.995px] justify-center items-center rounded-[14px] ${el.accent}`}>
                {el.icon}
              </div>
              <p className="text-white text-right text-[30px] font-bold leading-[36px]">{el?.valuePrefix}{el.value}</p>
            </div>
            <div className="mt-5!">
              <p className={`${el.textColor}`}>{el.subtitle}</p>
            </div>
          </div>
        ))}

      </div>

      <div className="w-full flex items-center justify-center">
        <CreditsTable />
      </div>
    </div>
  );
};
