import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createProject,
  enhancePrompt,
  generateCodePublish,
  listProject,
  listProjectGuest,
  updateProject,
  uploadThumbnail,
  saveGameGenres,
  saveGameOrientation,
  updateSDKVersion,
  uploadPreview,
  ChatFlow,
  RefreshAssets,
  type MessageBlock,
} from "../lib/apiClient";
import { Login } from "../lib/apiClientUser";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth";
import { checkDUELTokenBalance, checkGameGPTNFTStakeCount } from "../lib/wager";
import { mainnet } from "viem/chains";
import { addressWhitelist } from "../lib/wager";
import { usePrivy } from "@privy-io/react-auth";
import { GameModel } from "./Types";
import type { GameSDKChecklist } from "./Types";
import { TopUpModal, CreditCheck, TierCheck } from "../components/TopUpModal";

type GameBuilderContext = {
  gameName: string;
  gameId: number;
  gameCode: string;
  gameLLM: string;
  gameModel: string;
  initialGameAssetMap: Record<string, File | string>;
  gameAssetMap: Record<string, File | string>;
  gameGenres: string[];
  gameOrientation: string;
  sdkVersion: number;
  approvalStatus: string;
  assetLoading: boolean;
  isFetching: boolean;
  gameSDKChecklist: GameSDKChecklist;
  gameThumbnail: File | string;
  gamePreview: File | string;
  gameEnhancePromptMessages: MessageBlock[];
  currentGamePrompt: string;
  userWallet: string;
  tokenBalance: number;
  userTier: string;
  isTopUpModalOpen: boolean;

  setGameSDKChecklist: React.Dispatch<React.SetStateAction<GameSDKChecklist>>;
  setInitialGameAssetMap: React.Dispatch<
    React.SetStateAction<Record<string, File | string>>
  >;
  setGameAssetMap: React.Dispatch<
    React.SetStateAction<Record<string, File | string>>
  >;
  setAssetLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setGameName: React.Dispatch<React.SetStateAction<string>>;
  setGameId: React.Dispatch<React.SetStateAction<number>>;
  setGameCode: React.Dispatch<React.SetStateAction<string>>;
  setGameLLM: React.Dispatch<React.SetStateAction<string>>;
  setGameModel: React.Dispatch<React.SetStateAction<string>>;
  setGameThumbnail: React.Dispatch<React.SetStateAction<File | string>>;
  setGamePreview: React.Dispatch<React.SetStateAction<File | string>>;
  setGameEnhancePromptMessages: React.Dispatch<
    React.SetStateAction<MessageBlock[]>
  >;
  setGameGenres: React.Dispatch<React.SetStateAction<string[]>>;
  setGameOrientation: React.Dispatch<React.SetStateAction<string>>;

  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setGamePrompt: (prompt: string) => void;
  enhanceGamePrompt: (string) => void;
  createGameStream: () => Promise<void>;
  iterateGameStream: (message: string) => Promise<void>;
  saveGame: () => Promise<void>;
  saveAssets: () => Promise<void>;
  saveThumbnail: () => Promise<void>;
  savePreview: () => Promise<void>;
  saveGenres: () => Promise<void>;
  saveOrientation: () => Promise<void>;
  saveSDKVersion: (version: number) => Promise<void>;
  saveQuests: (
    quests: Array<{ description: string; difficultyLevel: number }>,
  ) => Promise<void>;
  setUserWallet: (wallet: string) => void;
  initializeGame: (
    id?: number,
    options?: { unauthenticated?: boolean },
  ) => Promise<void>;
  fetchUser: (id?: string) => Promise<void>;
  setTokenBalance: (balance: number) => void;
  setUserTier: (tier: string) => void;
  setIsTopUpModalOpen: (open: boolean) => void;
};

const GameBuilder = createContext<GameBuilderContext>({
  gameName: "",
  gameId: -1,
  gameCode: "",
  gameLLM: GameModel.GEMINI,
  gameModel: "gemini-2.5-pro",
  gameAssetMap: {},
  initialGameAssetMap: {},
  assetLoading: false,
  isFetching: false,
  gameGenres: [],
  gameOrientation: "portrait",
  sdkVersion: 0,
  approvalStatus: "pending",
  gameSDKChecklist: {
    ready: {
      completed: false,
      message: "Waiting for event...",
    },
    start: {
      completed: false,
      message: "Waiting for event...",
    },
    score: {
      completed: false,
      message: "Waiting for event...",
    },
    over: {
      completed: false,
      message: "Waiting for event...",
    },
    wager: {
      completed: false,
      message: "Waiting for event...",
    },
    quests: {
      completed: false,
      message: "Waiting for integration...",
    },
  },
  gameEnhancePromptMessages: [],
  currentGamePrompt: "",
  gameThumbnail: null,
  gamePreview: null,
  userWallet: "",
  tokenBalance: 0,
  userTier: "BASIC",
  isTopUpModalOpen: false,

  initializeGame: () => Promise.resolve(),
  fetchUser: () => Promise.resolve(),
  setIsFetching: () => {},
  setGameSDKChecklist: () => {},
  setGameAssetMap: () => {},
  setAssetLoading: () => {},
  setInitialGameAssetMap: () => {},
  setGameName: () => {},
  setGameId: () => {},
  setGameCode: () => {},
  setGameLLM: () => {},
  setGameModel: () => {},
  setGameEnhancePromptMessages: () => {},
  setGamePrompt: () => {},
  enhanceGamePrompt: () => {},
  createGameStream: () => Promise.resolve(),
  iterateGameStream: () => Promise.resolve(),
  setGameThumbnail: () => {},
  setGamePreview: () => {},
  setUserWallet: () => {},
  setGameGenres: () => {},
  setGameOrientation: () => {},
  setTokenBalance: () => {},
  saveGame: () => Promise.resolve(),
  saveAssets: () => Promise.resolve(),
  saveThumbnail: () => Promise.resolve(),
  savePreview: () => Promise.resolve(),
  saveGenres: () => Promise.resolve(),
  saveOrientation: () => Promise.resolve(),
  saveSDKVersion: () => Promise.resolve(),
  setUserTier: () => {},
  setIsTopUpModalOpen: () => {},
  saveQuests: () => Promise.resolve(),
});

export const GameBuilderContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [gameId, setGameId] = useState(-1);
  const [gameCode, setGameCode] = useState("");
  const [gameName, setGameName] = useState("");
  const [gameGenres, setGameGenres] = useState<string[]>([]);
  const [gameOrientation, setGameOrientation] = useState<string>("portrait");
  const [sdkVersion, setSDKVersion] = useState<number>(0);
  const [approvalStatus, setApprovalStatus] = useState<string>("pending");
  const [gameThumbnail, setGameThumbnail] = useState<File | string>(null);
  const [gamePreview, setGamePreview] = useState<File | string>(null);
  const [gameLLM, setGameLLM] = useState<GameModel>(GameModel.GEMINI);
  const [gameModel, setGameModel] = useState<string>("gemini-2.5-pro");
  const [currentGamePrompt, setCurrentGamePrompt] = useState("");
  const [isEligible, setEligibility] = useState(false);
  const { wallets } = useWallets();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [userTier, setUserTier] = useState("BASIC");
  const [isFetching, setIsFetching] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [gameAssetMap, _setGameAssetMap] = useState<
    Record<string, File | string>
  >({});
  const [assetLoading, setAssetLoading] = useState(true);
  const [initialGameAssetMap, setInitialGameAssetMap] = useState<
    Record<string, File | string>
  >({});
  const [userWallet, setUserWallet] = useState("");
  const [gameSDKChecklist, setGameSDKChecklist] = useState({
    ready: {
      completed: false,
      message: "Waiting for event...",
    },
    start: {
      completed: false,
      message: "Waiting for event...",
    },
    score: {
      completed: false,
      message: "Waiting for event...",
    },
    over: {
      completed: false,
      message: "Waiting for event...",
    },
    wager: {
      completed: false,
      message: "Waiting for event...",
    },
    quests: {
      completed: false,
      message: "Waiting for integration...",
    },
  });
  const [gameEnhancePromptMessages, setGameEnhancePromptMessages] = useState<
    MessageBlock[]
  >([]);
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (gameEnhancePromptMessages.length == 0) return;

    setCurrentGamePrompt(gameEnhancePromptMessages.slice(-1)[0].content);
  }, [gameEnhancePromptMessages]);

  const fetchUser = async () => {
    const privyID = user?.id;
    if (!privyID || !wallets[0]?.address) return;
    const DBuser = await Login(privyID, wallets[0].address);

    setTokenBalance(DBuser.tokens);
    setUserWallet(wallets[0].address);
    setUserTier(DBuser.tier);
  };

  useEffect(() => {
    if (isFetching) return;

    if (!ready || !authenticated || !user?.id || !wallets[0]?.address) return;
    const initalizeUser = async () => {
      setIsFetching(true);
      await fetchUser();
      setIsFetching(false);
    };

    initalizeUser();
  }, [authenticated, ready, user?.id, wallets[0]?.address]);

  const setGameAssetMap: React.Dispatch<
    React.SetStateAction<Record<string, File | string>>
  > = (updater) => {
    _setGameAssetMap((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: typeof prev) => typeof prev)(prev)
          : updater;

      const version = Date.now();
      const withVersion: Record<string, File | string> = {};

      for (const [key, value] of Object.entries(next)) {
        if (typeof value === "string" && value !== "") {
          const [base] = value.split("?v="); // strip old version if any
          withVersion[key] = `${base}?v=${version}`;
        } else {
          withVersion[key] = value; // Files pass through unchanged
        }
      }

      return withVersion;
    });
  };

  const initializeGame = async (
    id?: number,
    options?: { unauthenticated?: boolean },
  ) => {
    if (id == null) {
      console.log("No game ID provided");
      return;
    }
    const projectRequest = options?.unauthenticated
      ? listProjectGuest(id)
      : listProject(id);
    const project = await toast.promise(projectRequest, {
      loading: "Loading project...",
      success: "Project loaded",
      error: "Failed to load project",
    });
    setGameId(project[0].id);
    setGameName(project[0].title);
    setGameCode(project[0].code);
    setGameGenres(project[0].genres);
    setGameOrientation(project[0].orientation || "portrait");
    setSDKVersion(project[0].sdkversion || 0);
    setApprovalStatus(project[0].approval.toLowerCase());

    if (project[0].sdkversion && project[0].sdkversion > 0) {
      gameSDKChecklist.ready.completed = true;
      gameSDKChecklist.over.completed = true;
      gameSDKChecklist.start.completed = true;
      gameSDKChecklist.wager.completed = true;
    }

    const keyToFileURL = (key: string) => {
      const IMAGE_ENDPOINT = import.meta.env.VITE_IMAGE_ENDPOINT;
      return IMAGE_ENDPOINT + "/" + key;
    };

    const assetMap: Record<string, string> = {};
    const assets = project[0].assets || [];
    for (const asset of assets) {
      const name = asset.asset_name ?? asset[0];
      const storageKey = asset.key ?? asset[1];
      try {
        const url = keyToFileURL(storageKey);
        assetMap[name] = url;
      } catch (error) {
        console.warn(`Failed to load asset ${name}:`, error);
        assetMap[name] = "";
      }
    }

    setGameAssetMap(assetMap);
    setInitialGameAssetMap(assetMap);
    setGameThumbnail(keyToFileURL(project[0].thumbnail));
  };

  useEffect(() => {
    for (const wallet of wallets) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, id] = wallet.chainId.split(":");

      if (parseInt(id) !== mainnet.id) {
        continue;
      }

      setEligibility(true);
      return;

      if (addressWhitelist.includes(wallet.address)) {
        setEligibility(true);
        return;
      }

      checkGameGPTNFTStakeCount(wallet.address).then((v) => {
        setEligibility((prev) => prev || v > 0);
      });
      checkDUELTokenBalance(wallet.address).then((v) => {
        setEligibility((prev) => prev || v >= 500_000);
      });
    }
  }, [wallets]);

  const verifyEligibility = (): boolean => {
    //removing stake check for now
    return true;
    if (!isEligible) {
      toast.error(
        "Sorry, your account does not meet requirements to use the Game Builder. You must have at least 500,000 $DUEL tokens or have staked a GameGPT NFT to use the AI Game Builder",
        {
          duration: 15000,
        },
      );

      return false;
    }

    return true;
  };

  const saveGame = async () => {
    if (!verifyEligibility()) return;

    if (gameId == -1) {
      const id = await toast.promise(
        createProject(gameName, gameCode, userWallet, gameModel),
        {
          loading: "Saving Game",
          success: "Game Saved",
          error: "An error occurred while saving your new game",
        },
      );
      setGameId(id);
    } else {
      await toast.promise(
        updateProject(gameId, gameName, gameCode, gameModel),
        {
          loading: "Saving Game",
          success: "Game Saved",
          error: "An error occurred while saving your game",
        },
      );
    }

    saveThumbnail();
    savePreview();
  };

  const saveAssets = async () => {
    if (!verifyEligibility()) return;
    if (isFetching) {
      toast.error("Please wait for finishing changes before uploading");
      return;
    }

    setIsFetching(true);
    const initialKeys = Object.keys(initialGameAssetMap);
    const currentKeys = Object.keys(gameAssetMap);
    const shouldDelete =
      initialKeys.length === currentKeys.length &&
      initialKeys.every((key) => currentKeys.includes(key));

    await toast.promise(RefreshAssets(shouldDelete, gameId, gameAssetMap), {
      loading: "Uploading Assets",
      success: "Assets uploaded",
      error: "An error occurred while uploading your assets",
    });

    setIsFetching(false);
  };

  const saveThumbnail = async () => {
    if (gameThumbnail instanceof File) {
      await toast.promise(uploadThumbnail(gameThumbnail, gameId), {
        loading: "Uploading Game Thumbnail",
        success: "Thumbnail uploaded",
        error: "An error ocurred while uploading the game thumbnail",
      });
    }
  };

  const savePreview = async () => {
    if (gamePreview instanceof File) {
      await toast.promise(uploadPreview(gamePreview, gameId), {
        loading: "Uploading Game Preview",
        success: "Thumbnail uploaded",
        error: "An error ocurred while uploading the game preview",
      });
    }
  };

  const saveGenres = async () => {
    await toast.promise(saveGameGenres(gameId, gameGenres), {
      loading: "Saving Game Genres",
      success: "Genres saved",
      error: "An error occurred while saving your game genres",
    });
  };

  const saveOrientation = async () => {
    await toast.promise(saveGameOrientation(gameId, gameOrientation), {
      loading: "Saving Game Orientation",
      success: "Orientation saved",
      error: "An error occurred while saving your game orientation",
    });
  };

  const saveSDKVersion = async (version: number) => {
    await toast.promise(updateSDKVersion(gameId, version), {
      loading: "Saving SDK Version",
      success: "SDK Version saved",
      error: "An error occurred while saving your SDK version",
    });
  };

  const saveQuests = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    quests: Array<{ description: string; difficultyLevel: number }>,
  ) => {
    // if (!verifyEligibility()) return;
    // if (gameId == -1) {
    //   toast.error("Please save your game before saving quests");
    //   return;
    // }
    // await toast.promise(
    //   updateProject(
    //     gameId,
    //     gameName,
    //     gameCode,
    //     gameModel,
    //     undefined,
    //     undefined,
    //     undefined,
    //     quests,
    //   ),
    //   {
    //     loading: "Saving Quests",
    //     success: "Quests Saved",
    //     error: "An error occurred while saving your quests",
    //   },
    // );
  };

  const enhanceGamePrompt = async (newPrompt: string) => {
    if (!TierCheck(userTier, gameModel)) return;
    if (!verifyEligibility()) return;
    if (!newPrompt || newPrompt.trim() === "") return;

    if (isFetching) {
      toast.error("Please wait for current enhancement to finish");
      return;
    }
    if (userTier === "BASIC") {
      toast.error("Please upgrade your account to PRO to use the Game Builder");
      return;
    }
    if (!CreditCheck(tokenBalance)) {
      setIsTopUpModalOpen(true);
      return;
    }

    setIsFetching(true);
    const newMessage: MessageBlock = { role: "user", content: newPrompt };
    const enhanced = await toast.promise(enhancePrompt([newMessage], gameLLM), {
      loading: "Enhancing Prompt...",
      success: "Done",
      error: "An error occurred",
    });
    setGameEnhancePromptMessages(enhanced);
    await fetchUser();
    setIsFetching(false);
  };

  const createGameStream = async () => {
    if (!verifyEligibility()) return;
    if (isFetching) {
      toast.error("Please wait for current enhancement to finish");
      return;
    }
    if (userTier === "BASIC") {
      toast.error("Please upgrade your account to PRO to use the Game Builder");
      return;
    }
    if (!CreditCheck(tokenBalance)) {
      setIsTopUpModalOpen(true);
      return;
    }
    if (!TierCheck(userTier, gameModel)) return;
    setIsFetching(true);
    const eventSource = await generateCodePublish(
      gameId,
      [
        {
          role: "user",
          content: `Generate a game named ${gameName} using the following description:\n ${currentGamePrompt}`,
        } as MessageBlock,
      ],
      gameLLM,
      gameModel,
    );

    return toast.promise(
      new Promise<void>((resolve) => {
        setGameCode("");
        eventSource.addEventListener("codegen", (event) => {
          const data = JSON.parse(event.data);
          const incomingText = data.text;

          // Now apply completed lines to the code
          setGameCode((prevCode) => {
            return prevCode + incomingText;
          });
        });

        eventSource.addEventListener("end", async () => {
          eventSource.close();
          await fetchUser();
          setIsFetching(false);
          resolve();
        });
      }),
      {
        loading: "Generating Game Code...",
        success: "Done",
        error: "An error occurred",
      },
    );
  };

  const iterateGameStream = async (message: string) => {
    if (!verifyEligibility()) return;
    if (isFetching) {
      toast.error("Please wait for current enhancement to finish");
      return;
    }
    if (userTier === "BASIC") {
      toast.error("Please upgrade your account to PRO to use the Game Builder");
      return;
    }

    if (!CreditCheck(tokenBalance)) {
      setIsTopUpModalOpen(true);
      return;
    }

    if (!TierCheck(userTier, gameModel)) return;

    setIsFetching(true);

    if (gameId === -1) {
      toast.error("Please save your game first before iterating");
      return;
    }

    const eventSource = await ChatFlow(gameId, message, gameLLM, gameModel);

    return toast.promise(
      new Promise<void>((resolve) => {
        setGameCode(""); // Clear existing code for new iteration

        eventSource.addEventListener("codegen", (event) => {
          const data = JSON.parse(event.data);
          const incomingText = data.text;

          // Accumulate the incoming code
          setGameCode((prevCode) => {
            return prevCode + incomingText;
          });
        });

        eventSource.addEventListener("end", async () => {
          eventSource.close();
          await fetchUser();
          setIsFetching(false);
          resolve();
        });

        eventSource.addEventListener("error", () => {
          eventSource.close();
          throw new Error("Stream connection failed");
        });
      }),
      {
        loading: "Iterating game based on your feedback...",
        success: "Game updated!",
        error: "An error occurred while updating your game",
      },
    );
  };

  const setGamePrompt = (prompt: string) => {
    setGameEnhancePromptMessages((oldMessages) => {
      let lastMessage = oldMessages[oldMessages.length - 1];

      if (!lastMessage) {
        lastMessage = {
          role: "user",
          content: prompt,
        } as MessageBlock;
      } else if (lastMessage.role !== "user") {
        lastMessage.content = prompt;
        oldMessages = oldMessages.slice(0, -1);
      } else {
        lastMessage = {
          role: "user",
          content: prompt,
        } as MessageBlock;
      }

      return [...oldMessages, lastMessage];
    });
  };

  return (
    <GameBuilder.Provider
      value={{
        gameId,
        gameCode,
        userWallet,
        gameName,
        gameLLM,
        gameModel,
        gameGenres,
        gameOrientation,
        sdkVersion,
        approvalStatus,
        isFetching,
        gameAssetMap,
        initialGameAssetMap,
        assetLoading,
        gameSDKChecklist,
        gameEnhancePromptMessages,
        currentGamePrompt,
        gameThumbnail,
        gamePreview,
        tokenBalance,
        userTier,
        isTopUpModalOpen,
        saveQuests,
        setIsTopUpModalOpen,
        setUserTier,
        setGameThumbnail,
        setGameGenres,
        setGameOrientation,
        setGamePreview,
        initializeGame,
        fetchUser,
        setGamePrompt,
        setGameEnhancePromptMessages,
        setGameSDKChecklist,
        setGameAssetMap,
        setInitialGameAssetMap,
        setAssetLoading,
        setGameName,
        setGameId,
        setGameCode,
        setGameLLM,
        setGameModel,
        setIsFetching,
        enhanceGamePrompt,
        createGameStream,
        iterateGameStream,
        setUserWallet,
        saveGame,
        saveAssets,
        saveGenres,
        saveOrientation,
        saveSDKVersion,
        saveThumbnail,
        savePreview,
        setTokenBalance,
      }}
    >
      {children}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        closeModal={() => setIsTopUpModalOpen(false)}
      />
    </GameBuilder.Provider>
  );
};

export const useGameBuilder = () => {
  const ctx = useContext(GameBuilder);
  if (!ctx) {
    throw new Error(
      "useGameBuilder must be used within a GameBuilder Provider",
    );
  }

  return ctx;
};
