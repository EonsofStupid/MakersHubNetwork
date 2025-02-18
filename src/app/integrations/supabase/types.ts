export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      themes: {
        Row: {
          id: string
          name: string
          description: string
          is_default: boolean
          design_tokens: Json
          component_tokens: Json[]
          composition_rules: Json
          cached_styles: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          is_default?: boolean
          design_tokens?: Json
          component_tokens?: Json[]
          composition_rules?: Json
          cached_styles?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          is_default?: boolean
          design_tokens?: Json
          component_tokens?: Json[]
          composition_rules?: Json
          cached_styles?: Json
          created_at?: string
          updated_at?: string
        }
      }
      theme_components: {
        Row: {
          id: string
          component_name: string
          styles: Json
          theme_id: string
          context: 'app' | 'admin' | 'shared'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          component_name: string
          styles: Json
          theme_id: string
          context?: 'app' | 'admin' | 'shared'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          component_name?: string
          styles?: Json
          theme_id?: string
          context?: 'app' | 'admin' | 'shared'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 