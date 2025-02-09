
import { Database } from "@/integrations/supabase/types";

export type BaselineConfig = Database["public"]["Tables"]["baseline_configs"]["Row"];

export type DataMaestroTab = 'api-keys' | 'csv-import' | 'visualizer' | 'baseline';

export interface APIKeyProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ImportSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  errors?: ImportError[];
}

export interface ImportError {
  row: number;
  column: string;
  message: string;
}
