
/**
 * Z-index layers for chat components
 * Centralized management to prevent z-index conflicts
 */

export const Z_LAYERS = {
  // Base layers
  base: 10,
  
  // UI Components
  sidebar: 20,
  header: 30,
  messages: 15,
  input: 16,
  
  // Floating elements
  floatingButton: 100,
  sidebarToggle: 50,
  modeSelector: 40,
  modePopup: 45,
  
  // Overlays and modals
  overlay: 200,
  modal: 300,
  tooltip: 400,
  
  // Top level elements
  alert: 500,
  notification: 600,
  
  // Dev tools
  devTools: 1000
};
