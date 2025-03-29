
// Admin tools types

export interface FrozenZone {
  id: string;
  name: string;
  elementId: string;
  isLocked: boolean;
}

export interface AdminTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  shortcut?: string;
  permission: string;
}

export interface QuickAction {
  id: string;
  icon: string;
  tooltip: string;
  path: string;
}
