
export type ChatModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'llama' | 'mistral' | 'custom';

export interface ChatModelConfig {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  context_window: number;
  is_default: boolean;
  is_active: boolean;
}

export interface ChatSystemPrompt {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatModerationSettings {
  enabled: boolean;
  content_filter_level: 'strict' | 'medium' | 'low' | 'none';
  prohibited_topics: string[];
  max_messages_per_hour: number;
  admin_review_queue: boolean;
}

export interface ChatSettings {
  default_model: string;
  system_prompt: string;
  allow_user_customization: boolean;
  moderation: ChatModerationSettings;
  streaming_enabled: boolean;
  message_history_limit: number;
  image_generation_enabled: boolean;
}

export interface UsageMetrics {
  period: 'daily' | 'weekly' | 'monthly';
  total_requests: number;
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  by_model: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
  }>;
}
