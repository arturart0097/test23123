export enum GameModel {
  GROK = "GROK",
  GEMINI = "GEMINI",
  CLAUDE = "CLAUDE",
}

export enum Tiers {
  BASIC = "BASIC",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
}

export const MODEL_CONFIGS = {
  GEMINI_2_PRO: { llm: "GEMINI", model: "gemini-2.5-pro" },
  GEMENI_2_FLASH: { llm: "GEMINI", model: "gemini-2.5-flash" },
  GEMINI_3_PRO: { llm: "GEMINI", model: "gemini-3-pro-preview" },
  GEMINI_3_FLASH: { llm: "GEMINI", model: "gemini-3-flash-preview" },
  CLAUDE_3: { llm: "CLAUDE", model: "claude-3-7-20230926" },
  CLAUDE_4: { llm: "CLAUDE", model: "claude-sonnet-4-5-20250929" },
  GROK_CODE: { llm: "GROK", model: "grok-code-fast-1" },
  GROK_4_FAST: { llm: "GROK", model: "grok-4-1-fast-reasoning" },
  GROK_4: { llm: "GROK", model: "grok-4-0709" },
};

export type GameSDKChecklist = {
  ready: {
    completed: boolean;
    message: string;
  };

  start: {
    completed: boolean;
    message: string;
  };
  score: {
    completed: boolean;
    message: string;
  };
  over: {
    completed: boolean;
    message: string;
  };
  wager: {
    completed: boolean;
    message: string;
  };
  quests: {
    completed: boolean;
    message: string;
  };
};
