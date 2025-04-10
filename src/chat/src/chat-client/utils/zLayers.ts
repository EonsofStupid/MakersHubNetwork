
/**
 * Z-index layer constants for the chat client
 * This ensures consistent stacking of UI elements
 * 
 * USAGE GUIDELINES:
 * - Always use these constants for z-index values
 * - Never use hardcoded z-index values in components
 * - Higher numbers appear above lower numbers
 * - Group related UI elements within the same layer range
 */
export const Z_LAYERS = {
  // Base layers (0-20)
  base: 10,
  
  // Main content areas (20-40)
  content: 20,
  messages: 30,
  input: 40,
  
  // Header elements (50)
  header: 50,
  
  // Sidebar elements (25-30)
  sidebar: 25,
  sidebarHeader: 26,
  sidebarContent: 25,
  sidebarFooter: 26,
  sidebarToggle: 28,
  
  // Floating elements (60-100)
  floatingButton: 60,
  
  // Modal elements (900-1000)
  overlay: 900,
  modal: 1000,
  
  // Popups and tooltips (1100-2000)
  tooltip: 1100,
  popover: 1100,
  dropdown: 1100,
  
  // Mode selector - positioned above all other UI components (5000)
  modeSelector: 5000,
  
  // Mode popup - MUST be significantly above ALL other elements (10000)
  // This ensures the mode popup is always visible regardless of other content
  modePopup: 10000,
  
  // Top-level notifications (highest priority)
  toast: 11000
} as const;

// Export type definition for Z_LAYERS
export type ZLayer = typeof Z_LAYERS[keyof typeof Z_LAYERS];
