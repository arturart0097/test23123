/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { listProject, type Project } from "../lib/apiClient";
import { useGameBuilder } from "../contexts/GameBuilderContext";
import { useNavigate } from "react-router";
import { deleteProject } from "../lib/apiClient";
import { useTutorial } from "../hooks/useTutorial";
import { Button } from "../components/Button";
import { Plus } from "lucide-react";

const IMAGE_ENDPOINT = import.meta.env.VITE_IMAGE_ENDPOINT;

function GameCard({
  title,
  thumbnailUrl,
  id,
  isPublished = false,
  views = 0,
  likes = 0,
  date,
}: {
  title: string;
  thumbnailUrl: string;
  id: number;
  isPublished?: boolean;
  views?: number;
  likes?: number;
  date?: string;
}) {
  const navigate = useNavigate();
  const { initializeGame } = useGameBuilder();
  const PLACEHOLDER = "/VibeThumbnail.png";
  let thumbnail = thumbnailUrl;
  if (
    !thumbnail ||
    thumbnail === "" ||
    thumbnail === "https://placehold.co/960x540"
  ) {
    thumbnail = PLACEHOLDER;
  }
  const displayDate = date ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-zinc-600/80 bg-zinc-900 shadow-lg" onClick={async (e) => {
      e.stopPropagation();
      await initializeGame(id);
      navigate(`/dashboard/create`);
    }}>
      {/* Image section */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        <div className="absolute right-3 top-3 flex items-center justify-end gap-2">
          {isPublished ? (
            <div className="flex gap-2">
              <div className="inline-flex justify-center items-center rounded-full px-[12.3px]! py-[4px]! border border-[#057DFF] bg-[#057DFF]/80">
                Published
              </div>
            </div>) : (
            <div className="flex gap-2">
              <div className="inline-flex justify-center items-center rounded-full px-[12.3px]! py-[4px]! border border-[#F094FA] bg-[#F094FA]/80">
                In Progress
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text section — solid dark footer */}
      <div className="flex flex-col gap-2 border-t border-zinc-700/80 bg-zinc-800/95 px-4! py-3!">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-eye text-zinc-500" />
              {views}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-heart text-zinc-500" />
              {likes}
            </span>
          </div>
          <span className="text-zinc-400">{displayDate}</span>
        </div>
      </div>
    </div>
  );
}

function GameListing() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in_progress" | "published"
  >("all");
  const { tutorial, step, advanceStep, skipTutorial } = useTutorial();
  const [showCongrats, setShowCongrats] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("onboardingCongrats") === "1";
  });

  const highlight = (!tutorial && step === 2) || step === 3;

  useEffect(() => {
    const fetchGames = async () => {
      setProjects(await listProject());
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.localStorage.getItem("onboardingCongrats") === "1";
    if (flag) setShowCongrats(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingStep = window.localStorage.getItem("onboardingStep");
      if (onboardingStep === "completed") {
        skipTutorial();
      }
    }
  }, [skipTutorial]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "published") {
      return p.approval === "approved";
    }

    if (statusFilter === "in_progress") {
      return p.approval !== "approved";
    }

    return true;
  });

  return (
    <div className="flex w-full p-3! flex-col">
      <div className="flex justify-between gap-4! w-full item-start">
        <div>
          <h1>Your Game Library</h1>
          <span>Manage and organize your created games</span>
        </div>
        <Button
          type="button"
          className={`gap-2! h-13`}
          onClick={() => {
            // navigate after advancing step to ensure Dashboard sees step 3 immediately
            window.requestAnimationFrame(() => {
              window.location.assign("/dashboard/create");
            });
          }}
        >
          <i className="fa-solid fa-plus"></i> New Game
        </Button>
      </div>

      <div className="flex justify-start items-center gap-3">
        <div className="relative flex items-center w-full max-w-[320px]">
          <i className="fa-solid fa-magnifying-glass absolute left-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full rounded-xl border border-zinc-600/80 bg-zinc-800/90 py-3! pl-11! pr-4! text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500"
          />
        </div>
        <button
          className={`flex justify-center items-center rounded-[10px] !px-[16px] !py-[8.5px] border transition-colors ${statusFilter === "all"
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-white/5 text-[#FFFFFF99]"
            }`}
          onClick={() => setStatusFilter("all")}
        >
          All Games
        </button>
        <button
          className={`flex justify-center items-center rounded-[10px] !px-[16px] !py-[8.5px] border transition-colors ${statusFilter === "in_progress"
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-white/5 text-[#FFFFFF99]"
            }`}
          onClick={() => setStatusFilter("in_progress")}
        >
          In Progress
        </button>
        <button
          className={`flex justify-center items-center rounded-[10px] !px-[16px] !py-[8.5px] border transition-colors ${statusFilter === "published"
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-white/5 text-[#FFFFFF99]"
            }`}
          onClick={() => setStatusFilter("published")}
        >
          Published
        </button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="mt-4! grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((p) => (
            <GameCard
              key={p.id}
              id={p.id}
              title={p.title}
              thumbnailUrl={
                p.thumbnail
                  ? `${IMAGE_ENDPOINT}/${p.thumbnail}`
                  : "https://placehold.co/960x540"
              }
              isPublished={p.approval === "approved"}
              views={1243}
              likes={89}
            />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4 text-center pt-30!">
          <h1 className="text-white font-[Unbounded] text-[24px] font-medium">
            Your game library is empty
          </h1>

          <span className="max-w-[520px] text-white/60 font-[Syne] text-[16px] leading-[26px]">
            Start your game development journey by creating your first game. Use our AI-powered tools to bring your ideas to life.
          </span>

          <div className="mt-4 flex items-center justify-center gap-5">
            <Button onClick={() => {
              // navigate after advancing step to ensure Dashboard sees step 3 immediately
              window.requestAnimationFrame(() => {
                window.location.assign("/dashboard/create");
              });
            }}>
              <Plus /> Create Your First Game
            </Button>

            <button className="flex justify-center items-center rounded-[14px] !px-[32px] !py-[16.5px] border border-white/10 bg-white/5">
              Browse Templates
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default GameListing;
