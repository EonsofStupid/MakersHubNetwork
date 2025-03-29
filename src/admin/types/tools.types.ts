
// Types for admin tools and functionality

// Frozen zones for content editing
export interface FrozenZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Admin tool configuration
export interface AdminToolConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  permissions: string[];
}

// Tool state for saving/restoring tool configurations
export interface ToolState {
  id: string;
  position?: { x: number; y: number };
  isOpen: boolean;
  data?: Record<string, unknown>;
}

// Quick access tool configuration
export interface QuickTool {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
}
