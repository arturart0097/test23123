import { useEffect, useState } from "react";

import { FileUpload } from "../FileUpload";
import { FusciaButton } from "../Buttons";
import IntegrationChecklistItem from "../Dashboard/Integration";
import { ModalPublished } from "../ModalPublished";
import { ProfileModal } from "../Profile";
import SectionCard from "../Dashboard/SectionCard";
import type { StepProps } from "./StepOne";
import { submitGameForApproval } from "../../lib/apiClient";
import toast from "react-hot-toast";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../Button";

const GAME_GENRES = [
  "Action",
  "Arcade",
  "Dungeon",
  "Fighter",
  "Puzzle",
  "Shooter",
  "Sports",
  "Racing",
];

export default function StepFour({ step }: StepProps) {
  const { user } = usePrivy();
  const gb = useGameBuilder();
  const [hasUsername, setHasUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [expandedSection, setExpandedSection] = useState(0);
  const collapseToggle = (section: number) => {
    if (section === expandedSection) {
      setExpandedSection(0);
      return;
    }
    setExpandedSection(section);
  };
  const [showModalPublished, setShowModalPublished] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const onThumbnailUpload = (files: FileList) => {
    if (files.length > 1) {
      toast.error("Please select only one thumbnail");
      return;
    }

    gb.setGameThumbnail(files[0]);
  };

  const publishGame = async () => {
    setShowModalPublished(true);

    if (!gb.gameId) {
      toast.error("Game not loaded properly, please reopen the game builder.");

      return;
    }

    if (
      !gb.gameSDKChecklist.ready.completed ||
      !gb.gameSDKChecklist.start.completed ||
      !gb.gameSDKChecklist.over.completed ||
      !gb.gameSDKChecklist.wager.completed
    ) {
      toast.error(
        "Please complete SDK integration before publishing your game."
      );
      return;
    }

    if (
      gb.gameThumbnail === null ||
      gb.gameThumbnail === "" ||
      gb.gameThumbnail.toString().endsWith("/null")
    ) {
      toast.error(
        "Please upload a game thumbnail before publishing your game."
      );
      return;
    }

    if (gb.gameGenres.length === 0) {
      toast.error(
        "Please select at least one game genre before publishing your game."
      );
      return;
    }

    if (!["portrait", "landscape"].includes(gb.gameOrientation.toLowerCase())) {
      toast.error(
        "Please select a game orientation before publishing your game."
      );
      return;
    }

    // setShowModalPublished(true);

    await toast.promise(submitGameForApproval(gb.gameId), {
      loading: "Submitting game for approval...",
      success: "Game submitted for approval!",
      error: "An error occurred while submitting your game for approval.",
    });
  };

  useEffect(() => {
    if (!user?.id) return;

    const asyncFetch = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_ARCADE_BACKEND}/api/user?privyId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const data = await response.json();
      if (!data?.username) return;

      setHasUsername(!user.id.includes(data.user.username));
      setNewUsername(data.user.username);
    };
    asyncFetch();
  }, [user]);

  const updateUsername = async () => {
    if (!user?.id) return;

    const response = await fetch(
      `${import.meta.env.VITE_ARCADE_BACKEND}/api/update?privyId=${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: "username",
          value: newUsername,
        }),
      }
    );

    if (!response.ok) {
      toast.error("Failed to update user data");
      return;
    }
    toast.success("Username updated successfully");
    setHasUsername(true);
  };

  const active = step === 3;

  return active ? (
    <div className="flex flex-col w-full min-h-[690px] overflow-auto! text-sm! rounded-xl pb-25!">
      <SectionCard
        title="Integrate with GameGPT"
        collapsed={expandedSection !== 1}
        onCollapseToggle={() => collapseToggle(1)}
      >
        <div className="text-2xl">
          Click on the Game Preview Tab and play your game. This checklist will
          automatically update as events are triggered.
        </div>
        <IntegrationChecklistItem
          title="Ready Check ('ready' event)"
          subtitle={gb.gameSDKChecklist.ready.message}
          verified={gb.gameSDKChecklist.ready.completed}
          completed={gb.gameSDKChecklist.ready.completed}
        />
        <IntegrationChecklistItem
          title="Wager Mode enabled ('wager_changed' event)"
          subtitle={gb.gameSDKChecklist.wager.message}
          verified={gb.gameSDKChecklist.wager.completed}
          completed={gb.gameSDKChecklist.wager.completed}
        />
        <IntegrationChecklistItem
          title="Ready Check ('start' event)"
          subtitle={gb.gameSDKChecklist.start.message}
          verified={gb.gameSDKChecklist.start.completed}
          completed={gb.gameSDKChecklist.start.completed}
        />
        <IntegrationChecklistItem
          title="Score Reported ('game_over' event)"
          subtitle={gb.gameSDKChecklist.over.message}
          verified={gb.gameSDKChecklist.over.completed}
          completed={gb.gameSDKChecklist.over.completed}
        />
        <IntegrationChecklistItem
          title="Quests Integrated (optional)"
          subtitle={gb.gameSDKChecklist.quests.message}
          verified={gb.gameSDKChecklist.quests.completed}
          completed={gb.gameSDKChecklist.quests.completed}
        />
        <div className="warning-message">
          Important: The 'start' event should be triggered after game ends and
          user 'replays' the game.
        </div>
      </SectionCard>
      <SectionCard
        title="Game Details"
        collapsed={expandedSection !== 2}
        onCollapseToggle={() => collapseToggle(2)}
      >
        {/* <IntegrationChecklistItem
          title="Capture Gameplay Video (Optional)"
          subtitle="Click the video icon to capture a gameplay video (preview tab)"
          completed={false}
          verified={false}
        /> */}
        <IntegrationChecklistItem
          title="Create a Game Thumbnail"
          subtitle="Create a game icon for your game (Hit 'Save' after upload)"
          completed={gb.gameThumbnail !== null}
          verified={false}
        >
          <form className="flex justify-center my-3!">
            <FileUpload
              name="Upload Thumbnail"
              className="white-black-btn"
              onFilesSelect={onThumbnailUpload}
            />
          </form>
        </IntegrationChecklistItem>
        <IntegrationChecklistItem
          title="Declare Genre"
          subtitle="Select all the genres that apply to your game"
          completed={gb.gameGenres.length > 0}
          verified={false}
        >
          <div className="grid grid-cols-4 px-5! py-2!">
            {GAME_GENRES.map((genre) => (
              <div key={genre} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={`genre${genre}`}
                  value={genre}
                  checked={gb.gameGenres.includes(genre)}
                  onChange={(ev) => {
                    const selected = ev.target.checked;
                    if (selected) {
                      gb.setGameGenres([...gb.gameGenres, genre]);
                    } else {
                      gb.setGameGenres(
                        gb.gameGenres.filter((g) => g !== genre)
                      );
                    }
                  }}
                />
                <label htmlFor={`genre${genre}`}>{genre}</label>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="flex w-[336px] justify-center items-center shrink-0 rounded-full bg-white/5 py-[12px]!"
              onClick={() => gb.saveGenres()}
            >
              Save
            </button>
          </div>
        </IntegrationChecklistItem>
        <IntegrationChecklistItem
          title="Game Orientation"
          subtitle="Select the orientation that's optimal for your gameplay"
          completed={true}
          verified={false}
        >
          <div className="grid grid-cols-2 px-5! py-2!">
            {["Portrait", "Landscape"].map((orientation) => (
              <div key={orientation} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="orientation"
                  id={`orientation${orientation}`}
                  value={orientation}
                  checked={gb.gameOrientation === orientation}
                  onChange={() => gb.setGameOrientation(orientation)}
                
                />
                <label htmlFor={`orientation${orientation}`} className="text-[#FFFFFFCC]">
                  {orientation}
                </label>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="flex w-[336px] justify-center items-center shrink-0 rounded-full bg-white/5 py-[12px]!"
              onClick={() => gb.saveOrientation()}
            >
              Save
            </button>
          </div>
        </IntegrationChecklistItem>
        {/* <IntegrationChecklistItem
          title="Create a Game Preview"
          subtitle="Create a game icon for your game (preview tab)"
          completed={false}
          verified={false}
        >
          <form>
            <FileUpload
              name="Upload Preview"
              className="white-black-btn"
              onFilesSelect={onPreviewUpload}
            />
          </form>
        </IntegrationChecklistItem> */}
      </SectionCard>

      {gb.approvalStatus === "rejected" ? (
        <p className="my-5 text-center text-red-400">
          Your game submission was rejected, please fix issues and resubmit!
        </p>
      ) : null}
      {gb.approvalStatus === "submitted" ? (
        <p className="my-5 text-center text-orange-400">
          Your game has been submitted for approval, but you can resubmit again
          below to reflect new changes.
        </p>
      ) : null}

      {gb.approvalStatus !== "approved" ? (
        <div className="flex justify-center">
          <Button className="w-full mx-[32px]! mt-4!" onClick={() => publishGame()}>
            Publish Game
          </Button>
        </div>
      ) : null}

      {gb.approvalStatus !== "pending" && !hasUsername ? (
        <div>
          <p className="my-5 text-center text-orange-400">
            Your username will be shown with game card on Arcade, consider
            setting a proper username below:
          </p>

          <div className="flex gap-5 my-5!">
            <input
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <FusciaButton
              padding="p-2! cursor-pointer!"
              onClick={() => updateUsername()}
            >
              Save
            </FusciaButton>
          </div>
        </div>
      ) : null}

      {showModalPublished && (
        <ModalPublished
          setShowModalPublished={setShowModalPublished}
          onUpdateProfile={() => {
            setShowModalPublished(false);
            setShowProfileModal(true);
          }}
        />
      )}
      {showProfileModal && (
        <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  ) : null;
}
