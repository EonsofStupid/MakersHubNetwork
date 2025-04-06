
import { ChatMode } from '../types';

interface SendMessageParams {
  message: string;
  context: string;
  mode: ChatMode;
}

/**
 * Sends a message to the appropriate LLM based on the current chat mode
 * 
 * Model selection logic:
 * - Developer mode: GPT-4 (OpenAI) - Best for code generation and technical solutions
 * - Debug mode: GPT-4 (OpenAI) - Best for analyzing errors and debugging
 * - Chat mode: Claude-3 (Anthropic) - Superior conversational capabilities
 * - Training mode: Claude-3 (Anthropic) - Better for educational explanations
 * - Ultra mode: GPT-4o (OpenAI) - Most powerful general-purpose model
 * - Image mode: DALL-E 3 (OpenAI) - For image generation tasks
 * - Planning mode: Claude-3 (Anthropic) - Better for long-form planning and organization
 */
export async function sendMessageToModel({ message, context, mode }: SendMessageParams): Promise<string> {
  console.log(`Sending message in ${mode} mode with context length: ${context.length}`);
  console.log(`Message first 50 chars: ${message.substring(0, 50)}...`);
  console.log(`Context first 50 chars: ${context.substring(0, 50)}...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Choose the model based on mode
  let selectedModel = "GPT-3.5"; // Default model
  let modelName = "OpenAI";
  
  if (mode === 'developer' || mode === 'debug') {
    // Developer modes use GPT for coding and technical assistance
    selectedModel = "GPT-4";
    modelName = "OpenAI";
  } 
  else if (mode === 'chat' || mode === 'training' || mode === 'planning') {
    // Community, learning, and planning modes use Claude for better conversational abilities
    selectedModel = "Claude-3";
    modelName = "Anthropic Claude";
  }
  else if (mode === 'ultra') {
    // Premium mode uses the most powerful model
    selectedModel = "GPT-4o";
    modelName = "OpenAI";
  }
  else if (mode === 'image') {
    // Image generation uses DALL-E
    selectedModel = "DALL-E 3";
    modelName = "OpenAI";
  }
  
  console.log(`Selected model: ${modelName} ${selectedModel}`);
  
  // Generate simulated response based on mode and selected model
  const modePrefix = {
    'chat': `Community response using ${modelName} ${selectedModel}:`,
    'ultra': `Premium response using ${modelName} ${selectedModel}:`,
    'developer': `Developer assistance using ${modelName} ${selectedModel}:`,
    'debug': `Debug help using ${modelName} ${selectedModel}:`,
    'image': `Image description using ${modelName} ${selectedModel}:`,
    'training': `Training guidance using ${modelName} ${selectedModel}:`,
    'planning': `Planning support using ${modelName} ${selectedModel}:`
  }[mode];
  
  // In production, this would call the actual model API
  // and include the retrieved RAG context in the prompt
  return `${modePrefix} This is a simulated response to: "${message}" using context from RAG system: "${context.substring(0, 100)}..."`;
}
