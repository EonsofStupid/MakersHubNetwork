
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          email: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          email?: string | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          email?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      themes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: string;
          context: string;
          tokens: Json | null;
          component_tokens: Json | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          parent_theme_id: string | null;
          metadata: Json | null;
          is_default: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status: string;
          context: string;
          tokens?: Json | null;
          component_tokens?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          parent_theme_id?: string | null;
          metadata?: Json | null;
          is_default?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          context?: string;
          tokens?: Json | null;
          component_tokens?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          parent_theme_id?: string | null;
          metadata?: Json | null;
          is_default?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
