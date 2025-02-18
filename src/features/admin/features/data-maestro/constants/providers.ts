
import { ApiKeyType } from '../types/api-keys';

interface Provider {
  value: ApiKeyType;
  label: string;
}

export const providers: Provider[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'stability', label: 'Stability AI' },
  { value: 'replicate', label: 'Replicate' },
  { value: 'custom', label: 'Custom Provider' },
  { value: 'zapier', label: 'Zapier' },
  { value: 'pinecone', label: 'Pinecone' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openrouter', label: 'OpenRouter' }
];
