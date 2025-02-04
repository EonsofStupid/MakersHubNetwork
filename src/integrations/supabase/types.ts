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
      manufacturers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      part_reviews: {
        Row: {
          cons: string[] | null
          content: string | null
          created_at: string
          helpful_votes: number | null
          id: string
          part_id: string | null
          pros: string[] | null
          rating: number | null
          title: string | null
          updated_at: string
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          cons?: string[] | null
          content?: string | null
          created_at?: string
          helpful_votes?: number | null
          id?: string
          part_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          cons?: string[] | null
          content?: string | null
          created_at?: string
          helpful_votes?: number | null
          id?: string
          part_id?: string | null
          pros?: string[] | null
          rating?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "part_reviews_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "printer_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_part_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_part_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "printer_part_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_parts: {
        Row: {
          category_id: string | null
          community_score: number | null
          compatibility: Json | null
          cons: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: Json | null
          id: string
          images: string[] | null
          manufacturer_id: string | null
          model_number: string | null
          name: string
          price_range: Json | null
          pros: string[] | null
          review_count: number | null
          slug: string
          specifications: Json | null
          status: Database["public"]["Enums"]["part_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          community_score?: number | null
          compatibility?: Json | null
          cons?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          manufacturer_id?: string | null
          model_number?: string | null
          name: string
          price_range?: Json | null
          pros?: string[] | null
          review_count?: number | null
          slug: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["part_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          community_score?: number | null
          compatibility?: Json | null
          cons?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          manufacturer_id?: string | null
          model_number?: string | null
          name?: string
          price_range?: Json | null
          pros?: string[] | null
          review_count?: number | null
          slug?: string
          specifications?: Json | null
          status?: Database["public"]["Enums"]["part_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "printer_part_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_parts_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_override_active: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          custom_styles: Json | null
          display_name: string | null
          id: string
          is_active: boolean | null
          last_forum_activity: string | null
          last_login: string | null
          layout_preference: Json | null
          motion_enabled: boolean | null
          platform_preference: string | null
          platform_specific_settings: Json | null
          preferences: Json | null
          primary_role_id: string | null
          profile_completed: boolean | null
          social_links: Json | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          admin_override_active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_styles?: Json | null
          display_name?: string | null
          id: string
          is_active?: boolean | null
          last_forum_activity?: string | null
          last_login?: string | null
          layout_preference?: Json | null
          motion_enabled?: boolean | null
          platform_preference?: string | null
          platform_specific_settings?: Json | null
          preferences?: Json | null
          primary_role_id?: string | null
          profile_completed?: boolean | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          admin_override_active?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          custom_styles?: Json | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          last_forum_activity?: string | null
          last_login?: string | null
          layout_preference?: Json | null
          motion_enabled?: boolean | null
          platform_preference?: string | null
          platform_specific_settings?: Json | null
          preferences?: Json | null
          primary_role_id?: string | null
          profile_completed?: boolean | null
          social_links?: Json | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_role_id_fkey"
            columns: ["primary_role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
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
          component_tokens: Json | null
          composition_rules: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          design_tokens: Json | null
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
          component_tokens?: Json | null
          composition_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          design_tokens?: Json | null
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
          component_tokens?: Json | null
          composition_rules?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          design_tokens?: Json | null
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
      check_is_super_admin_for_policy: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      ensure_theme_token_structure: {
        Args: {
          data: Json
        }
        Returns: Json
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
      jsonb_deep_merge: {
        Args: {
          a: Json
          b: Json
        }
        Returns: Json
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
      part_status: "draft" | "published" | "archived"
      theme_status: "draft" | "published" | "archived"
      user_role: "super_admin" | "admin" | "maker" | "builder"
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
