
import { Database } from "@/integrations/supabase/types";

export type BaselineConfig = Database["public"]["Tables"]["baseline_configs"]["Row"];

// Rename to DataMaestroTabId to avoid confusion with component name
export type DataMaestroTabId = 'api-keys' | 'csv-import' | 'visualizer' | 'baseline';

export interface APIKeyProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Use database types as source of truth
export type ImportSession = Database["public"]["Tables"]["import_sessions"]["Row"];

// Use database types as source of truth
export type ImportError = Database["public"]["Tables"]["import_errors"]["Row"];

// Visualization types
export type NodeType = 'part' | 'category' | 'manufacturer';
export type EdgeType = 'requires' | 'compatible-with' | 'upgrades' | 'alternative-to' | 'accessory-for';

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
