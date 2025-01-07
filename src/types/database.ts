export interface Sensor {
  id: string;
  type: string;
  accuracy: string;
  firmware_compatibility: string[];
  printer_models: string[];
  mounting_type: string;
  dimensions: string;
  weight: string;
  probe_material: string;
  connector_type: string;
  has_self_test: boolean;
  includes_alarm: boolean;
  average_price: number;
  site_rating: number;
  average_rating: number;
  image_url: string;
  english_reviews_count: number;
  summary: string;
  pros: string[];
  cons: string[];
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  price: number;
  trending: boolean;
  value_rating: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      sensors: {
        Row: Sensor;
        Insert: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sensor, 'id'>>;
      };
      components: {
        Row: Component;
        Insert: Omit<Component, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Component, 'id'>>;
      };
    };
  };
};

export type DatabaseTables = {
  sensors: Sensor;
  components: Component;
}