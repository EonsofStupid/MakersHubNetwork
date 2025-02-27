
export interface ChatSettings {
  defaultModel: string;
  contextWindow: number;
  maxResponseTokens: number;
  temperature: number;
  systemPrompt: string;
  allowUserCustomization: boolean;
  moderationEnabled: boolean;
  rateLimits: {
    requestsPerDay: number;
    tokensPerRequest: number;
  };
}
