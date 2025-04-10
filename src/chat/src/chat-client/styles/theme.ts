
import { Z_LAYERS } from "../utils/zLayers";

/**
 * Glassmorphism theme class for reuse across components
 */
export const glassCardClass = `
  backdrop-filter: blur(12px)
  bg-teal-300/10
  border border-teal-500/20
  shadow-lg shadow-teal-400/10
  rounded-2xl
  ring-1 ring-inset ring-teal-300/20
`;

/**
 * MakersImpulse Chat Theme System
 * Centralized styling for all chat components
 */
export const chatTheme = {
  // Container styling
  container: "flex flex-col bg-[var(--chat-background)] rounded-lg font-[var(--chat-font)] overflow-hidden chat-shadow border border-[var(--chat-border-color)] glass-deep h-full",
  
  // Message list styling
  messageList: `flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-[${Z_LAYERS.messages}]`,
  
  // Message bubbles
  userBubble: "text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[80%] ml-auto animate-[bubble-out_0.3s_ease-out] bg-gradient-to-br from-[var(--chat-bubble-user-from)] to-[var(--chat-bubble-user-to)] shadow-sm depth-effect message-hover-effect",
  aiBubble: "text-[var(--chat-text-primary)] rounded-2xl rounded-bl-none px-4 py-2 max-w-[80%] glass-message animate-[bubble-in_0.3s_ease-out] shadow-sm relative group message-hover-effect",
  systemBubble: "text-[var(--chat-text-secondary)] bg-transparent border border-[var(--chat-border-color)]/30 rounded-lg px-4 py-2 max-w-[90%] mx-auto text-center text-sm message-hover-effect",
  
  // Avatars
  userAvatar: "border-2 border-[var(--chat-bubble-user-from)] h-8 w-8 depth-effect rounded-full overflow-hidden",
  botAvatar: "border border-[var(--chat-primary-accent)] h-8 w-8 bg-transparent cyber-glow rounded-full overflow-hidden",
  
  // Input area
  inputContainer: `border-t border-[var(--chat-border-color)] p-3 bg-[var(--chat-input-background)]/50 backdrop-blur-md relative z-[${Z_LAYERS.input}]`,
  inputWrapper: "flex items-center w-full px-3 py-2 bg-[var(--chat-input-background)] border border-[var(--chat-input-border)] rounded-full glass-bg shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] cyber-border inner-shadow",
  input: "flex-grow bg-transparent border-none text-[var(--chat-input-text)] placeholder:text-[var(--chat-input-placeholder)] focus:outline-none focus:ring-0 px-2",
  sendButton: "ml-2 p-2 rounded-full bg-[var(--chat-send-button-bg)] text-[var(--chat-send-button-text)] hover:bg-[var(--chat-send-button-bg)]/90 chat-transition-fast flex items-center justify-center cyber-text-glow apple-button",
  
  // Mode selector
  modeSelector: `px-2 relative z-[${Z_LAYERS.modeSelector}]`,
  modeButton: "flex items-center justify-between rounded-md px-3 py-1.5 bg-[var(--chat-mode-selector-bg)] text-[var(--chat-text-primary)] hover:bg-[var(--chat-mode-selector-hover-bg)] transition-all duration-300 border border-[var(--chat-border-color)]/40 text-xs glass-bg inner-shadow",
  modeMenu: `absolute top-full right-0 z-[${Z_LAYERS.modePopup}] mt-1 rounded-lg bg-[var(--chat-mode-menu-bg)] border border-[var(--chat-border-color)]/40 glass-deep depth-effect shadow-2xl w-44`,
  modeMenuItem: "rounded-md text-[var(--chat-text-primary)] hover:bg-[var(--chat-mode-item-hover-bg)] transition-all duration-200 chat-transition-fast border border-transparent hover:border-[var(--chat-border-color)]/50 text-sm message-hover-effect",
  activeMenuItem: "border-[var(--chat-primary-accent)]/60 bg-[var(--chat-mode-item-active-bg)] cyber-glow",
  
  // Header
  header: `flex justify-between items-center p-2 border-b border-[var(--chat-border-color)] bg-[var(--chat-mode-selector-bg)] glass-bg inner-shadow relative z-[${Z_LAYERS.header}]`,
  headerTitle: "font-medium text-[var(--chat-text-primary)] cyber-text-glow text-sm",
  
  // Buttons
  iconButton: "p-1.5 rounded-full hover:bg-[var(--chat-input-background)] chat-transition-fast text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)]",
  
  // Chat trigger
  chatTrigger: `bg-[var(--chat-primary-accent)] hover:bg-[var(--chat-primary-accent)]/90 text-white p-4 rounded-full shadow-lg chat-transition-fast cyber-glow apple-button z-[${Z_LAYERS.floatingButton}]`,
  
  // Sidebar
  sidebar: `h-full bg-[var(--chat-sidebar-bg)] border-r border-[var(--chat-sidebar-border)] flex flex-col glass-deep depth-effect custom-scrollbar z-[${Z_LAYERS.sidebar}]`,
  sidebarHeader: "flex items-center justify-between p-3 border-b border-[var(--chat-sidebar-border)]",
  sidebarBody: "flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar",
  sidebarItem: "rounded-md cursor-pointer p-2 text-sm transition-all duration-200 message-hover-effect",
  sidebarItemActive: "bg-[var(--chat-sidebar-active)] text-white glass-bg",
  sidebarItemInactive: "bg-[var(--chat-sidebar-item-bg)] text-white/80 hover:bg-[var(--chat-sidebar-item-hover)] glass-bg",
  sidebarToggle: `absolute top-2 left-2 p-1.5 rounded-full bg-[var(--chat-mode-selector-bg)] text-[var(--chat-text-secondary)] hover:text-[var(--chat-text-primary)] chat-transition-fast hover:bg-[var(--chat-mode-selector-hover-bg)] z-[${Z_LAYERS.sidebarToggle}] glass-bg cyber-border`,
  
  // Code blocks
  codeBlock: "relative bg-[rgba(16,25,34,0.9)] rounded-md my-2 overflow-hidden border border-[var(--chat-border-color)]/30 glass-bg",
  codeHeader: "flex items-center justify-between px-4 py-2 border-b border-[var(--chat-border-color)]/30 text-xs text-[var(--chat-text-secondary)] bg-[rgba(16,25,34,0.95)]",
  code: "p-4 overflow-x-auto text-sm custom-scrollbar",
  copyButton: `opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded bg-[var(--chat-copy-button-bg)] hover:bg-[var(--chat-copy-button-hover)] text-white/70 hover:text-white text-xs transition-opacity glass-bg z-[${Z_LAYERS.floatingButton}]`,

  // New conversation button
  newConversationBtn: "w-full p-2 mb-2 rounded-md text-sm bg-[var(--chat-primary-accent)]/20 text-[var(--chat-text-primary)] hover:bg-[var(--chat-primary-accent)]/30 border border-[var(--chat-border-color)]/50 chat-transition-fast flex items-center justify-center gap-2 glass-bg apple-button cyber-text-glow",
};
