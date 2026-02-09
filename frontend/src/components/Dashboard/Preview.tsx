import { ProfileCard } from "../ProfileCard";
import { AnnoucementCard } from "../AnnoucementsCard";
import { DashboardCard } from "./DashboardCard";
import discord_logo from "../../assets/discord-logo.png";
import "../../sass/DiscordCard.scss";
import "../../sass/Dashboard.scss";
import "../../sass/WhitepaperCard.scss";
import { useTutorial } from "../../hooks/useTutorial";
import { Rating } from "../Rating";
import { useNavigate } from "react-router";
import bell from "../../assets/bell.svg"
import { Button } from "../Button";
import qw2 from "../../assets/qw2.png";
import qw1 from "../../assets/qw1.png";

import { ButtonBlue } from "../ButtonBlue"

function CardRow({ children, className = "" }) {
  return (
    <div
      className={`card-row grid w-full gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-start ${className}`}
    >
      {children}
    </div>
  );
}

function DiscordCard() {
  return (
    <div className="flex w-[365.997px] h-[153.175px] flex-col items-start gap-[11.999px] shrink-0 rounded-[16px] border border-[rgba(5,125,255,0.2)] bg-gradient-to-b from-[#1A1B1F] to-[#0F1014] px-[24.596px] pt-[24.596px] pb-[0.599px]">
      <div className="flex flex-col items-start p-5!">
        <div className="flex gap-2 items-center pb-3!">
          <div className="flex w-[47.995px] h-[47.995px] pl-0 justify-center items-center rounded-[14px] bg-[rgba(5,125,255,0.2)]">
            🎮
          </div>
          <p className="text-white text-[30px] font-bold leading-[36px]">
            12
          </p>
        </div>
        <span className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px]">
          Games started
        </span>
      </div>
    </div>
  );
}

function WhitepaperCard() {
  return (
    <div className="flex w-[365.997px] h-[153.175px] flex-col items-start gap-[11.999px] shrink-0 rounded-[16px] border border-[rgba(5,125,255,0.2)] bg-gradient-to-b from-[#1A1B1F] to-[#0F1014] px-[24.596px] pt-[24.596px] pb-[0.599px]">
      <div className="flex flex-col items-start p-5!">
        <div className="flex gap-2 items-center pb-3!">
          <div className="flex w-[47.995px] h-[47.995px] pl-0 justify-center items-center rounded-[14px] bg-[rgba(5,125,255,0.2)]">
            💻
          </div>
          <p className="text-white text-[30px] font-bold leading-[36px]">
            8,233
          </p>
        </div>
        <span className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px]">
          Lines of Code
        </span>
      </div>
    </div>
  );
}

function IntroVideoCard() {
  const { openIntro } = useTutorial();

  return (
    <div className="flex w-[365.997px] h-[153.175px] flex-col items-start gap-[11.999px] shrink-0 rounded-[16px] border border-[rgba(5,125,255,0.2)] bg-gradient-to-b from-[#1A1B1F] to-[#0F1014] px-[24.596px] pt-[24.596px] pb-[0.599px]">
      <div className="flex flex-col items-start p-5!">
        <div className="flex gap-2 items-center pb-3!">
          <div className="flex w-[47.995px] h-[47.995px] pl-0 justify-center items-center rounded-[14px] bg-[rgba(5,125,255,0.2)]">
            📊
          </div>
          <p className="text-white text-[30px] font-bold leading-[36px]">
            129
          </p>
        </div>
        <span className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px]">
          Developer Rating
        </span>
      </div>
    </div>
  );
}

function IntroVideoCard2() {

  return (
    <div className="flex w-[365.997px] h-[153.175px] flex-col items-start gap-[11.999px] shrink-0 rounded-[16px] border border-[rgba(5,125,255,0.2)] bg-gradient-to-b from-[#1A1B1F] to-[#0F1014] px-[24.596px] pt-[24.596px] pb-[0.599px]">
      <div className="flex flex-col items-start p-5!">
        <div className="flex gap-2 items-center pb-3!">
          <div className="flex w-[47.995px] h-[47.995px] pl-0 justify-center items-center rounded-[14px] bg-[rgba(5,125,255,0.2)]">
            ⭐
          </div>
          <p className="text-white text-[30px] font-bold leading-[36px]">
            Gold Pack
          </p>
        </div>
        <span className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px]">
          Current Plan
        </span>
        <span className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px]">
          5000 Credits
        </span>
      </div>
    </div>
  );
}

export default function Preview({ onProfile }) {
  return (
    <div className="pb-5!">
      <div>
        <h1 className="text-white text-[36px] font-medium leading-[40px]">Dashboard</h1>
        <p className="text-[rgba(255,255,255,0.6)] text-[14px] font-normal leading-[20px] mt-2!">Welcome back, User1234</p>
        <div className="flex w-full justify-center items-center gap-7! mt-6!">
          <DiscordCard />
          <WhitepaperCard />
          <IntroVideoCard />
          <IntroVideoCard2 />
        </div>
      </div>
      <div className="w-full h-[271px] p-7! rounded-[16px] gap-7! flex flex-col justify-start items-start bg-[linear-gradient(135deg,rgba(5,125,255,0.3)_0%,rgba(103,96,255,0.3)_35%,rgba(240,148,250,0.3)_100%)] mt-7!">
        <div className="flex items-center text-[#057DFF] text-[14px] font-normal leading-[20px] tracking-[0.7px] uppercase gap-1">
          <img src={bell} alt="bell" />
          Latest News
        </div>
        <div className="text-left">
          <p className="text-[#057DFF] text-[24px] font-normal leading-[20px] tracking-[0.7px] uppercase text-white font-bold">Announcement</p>
          <p className="text-[rgba(255,255,255,0.8)] font-syne text-[16px] font-normal leading-[26px]">
            GameGPT Alpha is live! Create, refine and improve your games, you'll be allowed to submit your games for the <br /> mode soon! Closed alpha for users with spots on eth network or staked NFT's on base
          </p>
        </div>
        <Button />
      </div>
      <div className="mt-7! flex w-full flex-col xl:flex-row gap-7! items-stretch">
        <div className="flex-1 h-100 rounded-[16px] border border-[rgba(5,125,255,0.2)] bg-[linear-gradient(135deg,#050712_0%,#101022_40%,#1B1024_100%)] flex flex-col lg:flex-row justify-between items-stretch gap-7!">
          <img src={qw2} alt="" />
        </div>

        <div className="w-full xl:w-[320px] flex flex-col gap-5!">
          <div className="rounded-[16px] border border-[rgba(5,125,255,0.15)] bg-[#0F1014] px-6! py-5! flex flex-col gap-4!">
            <div className="flex items-center justify-between">
              <p className="text-white text-[16px] font-semibold">
                Community
              </p>
            </div>
            <div className="flex flex-col gap-2!">
              {["Twitter", "Discord", "Telegram"].map((item) => (
                <button
                  key={item}
                  className="flex items-center justify-between rounded-[12px] bg-[#14151A] px-4! py-3! text-[14px] text-[rgba(255,255,255,0.8)] hover:bg-[#191A21] transition-colors"
                >
                  <p>{item}</p>
                  <p className="text-[18px] text-[rgba(255,255,255,0.4)]">
                    ›
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[rgba(5,125,255,0.15)] bg-[#0F1014] px-6! py-5! flex flex-col gap-4!">
            <div className="flex items-center justify-between">
              <p className="text-white text-[16px] font-semibold">
                Resources
              </p>
            </div>
            <div className="flex flex-col gap-2!">
              <button className="flex items-center justify-between rounded-[12px] bg-[#14151A] px-4! py-3! text-[14px] text-[rgba(255,255,255,0.8)] hover:bg-[#191A21] transition-colors">
                <p>Whitepaper</p>
                <p className="text-[18px] text-[rgba(255,255,255,0.4)]">
                  ›
                </p>
              </button>
              <button className="flex items-center justify-between rounded-[12px] bg-[#14151A] px-4! py-3! text-[14px] text-[rgba(255,255,255,0.8)] hover:bg-[#191A21] transition-colors">
                <p>Tutorial</p>
                <div className="inline-flex items-center gap-2">
                  <p className="rounded-[999px] bg-[rgba(240,148,250,0.18)] px-3! py-1! text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F094FA]">
                    Soon
                  </p>
                  <p className="text-[18px] text-[rgba(255,255,255,0.4)]">
                    ›
                  </p>
                </div>
              </button>
            </div>
          </div>

          <ButtonBlue>Send Feedback</ButtonBlue>
        </div>
      </div>
      <img src={qw1} alt="" className="mt-5!" />
    </div>
  );
}
