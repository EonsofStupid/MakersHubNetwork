
export interface FrozenZone {
  id: string;
  name: string;
  elementId: string;
  isLocked: boolean;
}

export interface ToolsState {
  activeToolName: string | null;
  isEditModeActive: boolean;
  activePalettes: string[];
  selectedEffect: string | null;
  frozenZones: FrozenZone[];
}
