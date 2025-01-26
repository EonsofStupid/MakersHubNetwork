export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      components: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          specifications: Json | null
          trending: boolean | null
          updated_at: string | null
          value_rating: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          specifications?: Json | null
          trending?: boolean | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          specifications?: Json | null
          trending?: boolean | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          action: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          subject: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          subject: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          subject?: string
        }
        Relationships: []
      }
      sensors: {
        Row: {
          accuracy: string | null
          average_price: number | null
          average_rating: number | null
          connector_type: string | null
          cons: string[] | null
          created_at: string | null
          dimensions: string | null
          english_reviews_count: number | null
          firmware_compatibility: string[] | null
          has_self_test: boolean | null
          id: string
          image_url: string | null
          includes_alarm: boolean | null
          mounting_type: string | null
          printer_models: string[] | null
          probe_material: string | null
          pros: string[] | null
          site_rating: number | null
          summary: string | null
          type: string
          updated_at: string | null
          weight: string | null
        }
        Insert: {
          accuracy?: string | null
          average_price?: number | null
          average_rating?: number | null
          connector_type?: string | null
          cons?: string[] | null
          created_at?: string | null
          dimensions?: string | null
          english_reviews_count?: number | null
          firmware_compatibility?: string[] | null
          has_self_test?: boolean | null
          id?: string
          image_url?: string | null
          includes_alarm?: boolean | null
          mounting_type?: string | null
          printer_models?: string[] | null
          probe_material?: string | null
          pros?: string[] | null
          site_rating?: number | null
          summary?: string | null
          type: string
          updated_at?: string | null
          weight?: string | null
        }
        Update: {
          accuracy?: string | null
          average_price?: number | null
          average_rating?: number | null
          connector_type?: string | null
          cons?: string[] | null
          created_at?: string | null
          dimensions?: string | null
          english_reviews_count?: number | null
          firmware_compatibility?: string[] | null
          has_self_test?: boolean | null
          id?: string
          image_url?: string | null
          includes_alarm?: boolean | null
          mounting_type?: string | null
          printer_models?: string[] | null
          probe_material?: string | null
          pros?: string[] | null
          site_rating?: number | null
          summary?: string | null
          type?: string
          updated_at?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      theme_components: {
        Row: {
          component_name: string
          context: string | null
          created_at: string | null
          id: string
          styles: Json
          theme_id: string | null
          updated_at: string | null
        }
        Insert: {
          component_name: string
          context?: string | null
          created_at?: string | null
          id?: string
          styles: Json
          theme_id?: string | null
          updated_at?: string | null
        }
        Update: {
          component_name?: string
          context?: string | null
          created_at?: string | null
          id?: string
          styles?: Json
          theme_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_components_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_tokens: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          fallback_value: string | null
          id: string
          theme_id: string | null
          token_name: string
          token_value: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          fallback_value?: string | null
          id?: string
          theme_id?: string | null
          token_name: string
          token_value: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          fallback_value?: string | null
          id?: string
          theme_id?: string | null
          token_name?: string
          token_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_variants: {
        Row: {
          created_at: string | null
          id: string
          styles: Json | null
          theme_id: string | null
          updated_at: string | null
          variant_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          styles?: Json | null
          theme_id?: string | null
          updated_at?: string | null
          variant_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          styles?: Json | null
          theme_id?: string | null
          updated_at?: string | null
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_variants_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_versions: {
        Row: {
          changes: Json
          created_at: string | null
          created_by: string | null
          id: string
          theme_id: string | null
          version: number
        }
        Insert: {
          changes: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          theme_id?: string | null
          version: number
        }
        Update: {
          changes?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          theme_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_versions_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          cache_key: string | null
          cached_styles: Json | null
          composition_rules: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          parent_theme_id: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["theme_status"] | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          cache_key?: string | null
          cached_styles?: Json | null
          composition_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          parent_theme_id?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["theme_status"] | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          cache_key?: string | null
          cached_styles?: Json | null
          composition_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          parent_theme_id?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["theme_status"] | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_parent_theme_id_fkey"
            columns: ["parent_theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_super_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_theme_inheritance_chain: {
        Args: {
          theme_id: string
        }
        Returns: {
          id: string
          level: number
        }[]
      }
      merge_theme_styles: {
        Args: {
          base_styles: Json
          override_styles: Json
        }
        Returns: Json
      }
    }
    Enums: {
      theme_status: "draft" | "published" | "archived"
      user_role: "admin" | "super_admin" | "maker" | "subscriber"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
