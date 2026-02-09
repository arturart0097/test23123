import { useState } from "react";
import { useGameBuilder } from "../../contexts/GameBuilderContext";
import GridLoader from "react-spinners/GridLoader";
import toast from "react-hot-toast";
import { FileIcon, ImageIcon } from "lucide-react";
import { Button } from "../Button";

type AssetType = "image" | "music" | "sfx";

const getAssetType = (key: string, source: File | string): AssetType => {
  // Check file extension from URL or filename
  let extension = "";

  if (source instanceof File) {
    extension = source.name.split(".").pop()?.toLowerCase() || "";
  } else if (typeof source === "string" && source) {
    // Extract extension from URL
    const urlPath = source.split("?")[0]; // Remove query params
    extension = urlPath.split(".").pop()?.toLowerCase() || "";
  }

  // Check key name for hints
  const keyLower = key.toLowerCase();
  if (
    keyLower.includes("sfx") ||
    keyLower.includes("sound") ||
    keyLower.includes("effect")
  ) {
    return "sfx";
  }
  if (
    keyLower.includes("music") ||
    keyLower.includes("bgm") ||
    keyLower.includes("audio")
  ) {
    return "music";
  }

  // Check extension
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"];
  const audioExtensions = ["mp3", "wav", "ogg", "m4a", "flac", "aac"];

  if (imageExtensions.includes(extension)) {
    return "image";
  }
  if (audioExtensions.includes(extension)) {
    // If it's audio but not explicitly music, assume sfx for small files or check key
    return keyLower.includes("music") || keyLower.includes("bgm")
      ? "music"
      : "sfx";
  }

  // Default to image if unknown
  return "image";
};

interface AssetTabProps {
  label: string;
  type: AssetType;
  activeTab: AssetType;
  setActiveTab: (type: AssetType) => void;
}

const AssetTab = ({ label, type, activeTab, setActiveTab }: AssetTabProps) => {
  const isActive = activeTab === type;
  return (
    <button
      type="button"
      onClick={() => setActiveTab(type)}
      className={`preview-tab ${isActive ? "active" : ""}`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

export default function AssetsTab() {
  const {
    gameAssetMap,
    setGameAssetMap,
    saveAssets,
    setGameThumbnail,
    saveThumbnail,
    assetLoading,
  } = useGameBuilder();

  const [activeAssetTab, setActiveAssetTab] = useState<AssetType>("image");

  const handleTabChange = (type: AssetType) => {
    setActiveAssetTab(type);
  };

  const gameAssetKeys = Object.keys(gameAssetMap);

  // Group assets by type
  const assetsByType = gameAssetKeys.reduce(
    (acc, key) => {
      const assetType = getAssetType(key, gameAssetMap[key]);
      if (!acc[assetType]) {
        acc[assetType] = [];
      }
      acc[assetType].push(key);
      return acc;
    },
    {} as Record<AssetType, string[]>
  );

  const getPreviewUrl = (source: File | string): string => {
    if (source instanceof File) {
      return URL.createObjectURL(source);
    }
    return source;
  };

  const renderAssetInput = (key: string, assetType: AssetType) => {
    const assetSource = gameAssetMap[key];
    const previewUrl = getPreviewUrl(assetSource);
    const isImage = assetType === "image";
    const inputId = `asset-input-${key}`;

    // Label inside "No file selected" input-style box
    let selectedLabel = "No file selected";
    if (assetSource instanceof File) {
      selectedLabel = assetSource.name;
    } else if (typeof assetSource === "string" && assetSource.trim() !== "") {
      const urlPath = assetSource.split("?")[0];
      selectedLabel = urlPath.split("/").pop() || "Current asset";
    }

    return (
      <div key={key} className="flex flex-col justify-center items-start gap-3 w-full px-12! mt-4!">
        <span className="min-w-28 font-mono text-sm">{key}</span>
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-[45.178px] flex-1 items-center px-4! py-3! rounded-[10px] border-[0.599px] border-white/10 bg-[#1A1B1F] text-xs text-white/60 truncate">
              {selectedLabel}
            </div>
            <div className="flex items-center gap-3">
              {isImage ? (
                <>
                  <label
                    htmlFor={inputId}
                    className="flex justify-center items-center gap-[7.993px] px-[24.466px]! pr-[24.596px]! pt-[12.796px]! pb-[12.401px]! rounded-[10px] border-[0.599px] border-white/10 bg-[#2D3139]"
                  >
                    <FileIcon width={16} height={16} color="#fff" />
                    CHOOSE FILE
                  </label>
                  <input
                    type="file"
                    id={inputId}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setGameAssetMap((prev) => ({ ...prev, [key]: file }));
                    }}
                    className="hidden"
                  />
                </>
              ) : (
                <button
                  type="button"
                  className="flex justify-center items-center gap-[7.993px] px-[24.466px]! pr-[24.596px]! pt-[12.796px]! pb-[12.401px]! rounded-[10px] border-[0.599px] border-white/10 bg-[#2D3139] cursor-pointer"
                  onClick={() => toast.success("Coming soon...")}
                >
                  <FileIcon width={16} height={16} color="#fff" />
                  CHOOSE FILE
                </button>
              )}
              {previewUrl && isImage && (
                <img
                  src={previewUrl}
                  alt={key}
                  className="h-10 w-10 rounded object-cover border border-zinc-700"
                />
              )}
              {previewUrl && !isImage && (
                <div className="h-10 w-10 rounded border border-zinc-700 flex items-center justify-center bg-zinc-800">
                  <span className="text-xs">🎵</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return assetLoading ? (
    <div className="flex flex-col h-full justify-center items-center ">
      <GridLoader size={20} color="#fff" />
      <div className="text-lg mt-7!">Loading assets... </div>
      <div className="text-sm italic">{`(Visit GamePreview to load assets into memory)`}</div>
    </div>
  ) : (
    <div className="assets">
      {/* Asset Type Tabs */}
      <div
        className="preview-tabs"
      >
        <AssetTab
          label="Images"
          type="image"
          activeTab={activeAssetTab}
          setActiveTab={handleTabChange}
        />
        <AssetTab
          label="Music"
          type="music"
          activeTab={activeAssetTab}
          setActiveTab={handleTabChange}
        />
        <AssetTab
          label="SFX"
          type="sfx"
          activeTab={activeAssetTab}
          setActiveTab={handleTabChange}
        />
      </div>

      {/* Assets for selected tab */}
      <div className="space-y-6">
        <div className="asset-url-inputs space-y-2 flex flex-col gap-5 items-center justify-center">
          {assetsByType[activeAssetTab]?.length > 0 ? (
            assetsByType[activeAssetTab].map((key) =>
              renderAssetInput(key, activeAssetTab)
            )
          ) : (
            <p className="text-zinc-500 text-sm text-center py-4 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40">
              No{" "}
              {activeAssetTab === "image"
                ? "images"
                : activeAssetTab === "music"
                  ? "music"
                  : "sound effects"}{" "}
              found.
            </p>
          )}
        </div>

        <div className="!mt-6 !pt-3 border-t border-zinc-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 !mt-2 items-center w-full">
              <h3 className="text-sm font-medium text-zinc-100">
                Game thumbnail
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                This image will be shown as the cover of your game.
              </p>

              <div className="flex items-center gap-3 !mb-5">
                <label
                  htmlFor="thumbnail-input"
                  className="flex h-[45px] justify-center items-start gap-[7.993px] pt-[12.598px]! pb-[12.204px]! pl-[32.599px]! pr-[32.417px]! shrink-0 rounded-[14px] border-[0.599px] border-white/10 bg-[#2D3139]"
                >
                  <ImageIcon color="#F094FA" width={19} height={19} />
                  CHOOSE FILE
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setGameThumbnail(file);
                  }}
                  className="hidden"
                  id="thumbnail-input"
                />

                {/* {gameThumbnail && (
                  <span className="text-xs text-zinc-400 truncate max-w-[160px]">
                    {gameThumbnail instanceof File ? gameThumbnail.name : gameThumbnail}
                  </span>
                )} */}
              </div>
            </div>

            {/* {gameThumbnail && (
              <div className="shrink-0">
                <div className="text-xs text-zinc-500 mb-1">Preview</div>
                <img
                  src={getPreviewUrl(gameThumbnail)}
                  alt="thumbnail"
                  className="h-16 w-16 rounded-lg object-cover border border-zinc-700 shadow-md"
                />
              </div>
            )} */}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-2! pb-12! px-12! w-full">
          <Button
            onClick={saveAssets}
            className="flex-1"
          >
            Save Assets
          </Button>
          <Button
            onClick={saveThumbnail}
            className="flex-1"
          >
            Save Thumbnail
          </Button>
        </div>
      </div>
    </div>
  );
}
