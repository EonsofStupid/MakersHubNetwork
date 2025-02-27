
// Enum for tab IDs to provide stricter type checking
export const DataMaestroTabIds = {
  API_KEYS: 'api-keys',
  CSV_IMPORT: 'csv-import',
  VISUALIZER: 'visualizer',
  BASELINE: 'baseline'
} as const;

export type DataMaestroTabId = typeof DataMaestroTabIds[keyof typeof DataMaestroTabIds];

export interface APIKeyProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Visualization types as source of truth for the graph
export const NodeTypes = {
  PART: 'part',
  CATEGORY: 'category',
  MANUFACTURER: 'manufacturer'
} as const;

export type NodeType = typeof NodeTypes[keyof typeof NodeTypes];

export const EdgeTypes = {
  REQUIRES: 'requires',
  COMPATIBLE_WITH: 'compatible-with',
  UPGRADES: 'upgrades',
  ALTERNATIVE_TO: 'alternative-to',
  ACCESSORY_FOR: 'accessory-for'
} as const;

export type EdgeType = typeof EdgeTypes[keyof typeof EdgeTypes];

export interface VisualNode {
  id: string;
  type: NodeType;
  label: string;
  data: Record<string, any>;
  style?: Record<string, any>;
}

export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  data?: Record<string, any>;
  style?: Record<string, any>;
}
