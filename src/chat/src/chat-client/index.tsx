
// Export main component
import './styles/variables.css';

// Main component exports
export { ChatClient } from "./components/ChatClient";
export { DockableChat } from "./components/DockableChat";

// Hook exports
export { useChatBridge } from "./lib/chatBridge";
export { useChatSession } from "./hooks/useChatSession";

// Type exports
export type { 
  ChatMessage, 
  ChatMode, 
  ChatStore, 
  ChatConversation, 
  ChatBridge, 
  PrinterContext, 
  ProjectContext,
  LogLevelType,
  LogCategoryType
} from "./types";

// Constants exports
export { LogLevel, LogCategory } from "./types";
export { Z_LAYERS } from "./utils/zLayers";
export { chatTheme } from "./styles/theme";
export { 
  glassCardClass, 
  glassStyles, 
  gradientStyles,
  shadowStyles,
  animationStyles
} from "./utils/chatTheme";

// Store exports
export { useChatStore } from "./state/chatStore";

// Utility exports
export { logger, Logger } from "./utils/logging";
