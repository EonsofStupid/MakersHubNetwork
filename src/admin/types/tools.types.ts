
/**
 * Type definitions for the admin tools
 */

export interface FrozenZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  type?: string;
  name: string;
  elementId: string;
  isLocked: boolean;
}

export interface DragAndDropItem {
  id: string;
  type?: string;
  data?: any;
}

export interface DragAndDropOptions {
  items: string[];
  containerId: string;
  onReorder?: (items: string[]) => void;
  onExternalDrop?: (item: DragAndDropItem, position: { x: number, y: number }) => void;
  acceptExternalItems?: boolean;
  dragOnlyInEditMode?: boolean;
}

export interface CyberEffect {
  id: string;
  name: string;
  css: string;
  animation?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

// Dashboard shortcut type (consolidated from previous type)
export interface DashboardShortcut {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  description?: string;
}
