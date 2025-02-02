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
      active_2fa_sessions: {
        Row: {
          created_at: string | null
          device_name: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_name: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_name?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_2fa_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_toolbar_shortcuts: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          position: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          position: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          position?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_toolbar_shortcuts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["post_category"] | null
          content: string
          excerpt: string | null
          featured_image: string | null
          id: string
          images: string[] | null
          published_at: string | null
          rich_content: Json | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["post_category"] | null
          content: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          rich_content?: Json | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["post_category"] | null
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          rich_content?: Json | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_components: {
        Row: {
          component_type: string
          created_by: string | null
          default_props: Json | null
          description: string | null
          id: string
          name: string
          props_schema: Json | null
          updated_at: string | null
        }
        Insert: {
          component_type: string
          created_by?: string | null
          default_props?: Json | null
          description?: string | null
          id?: string
          name: string
          props_schema?: Json | null
          updated_at?: string | null
        }
        Update: {
          component_type?: string
          created_by?: string | null
          default_props?: Json | null
          description?: string | null
          id?: string
          name?: string
          props_schema?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_components_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string | null
          updated_by: string | null
          version: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_relationships: {
        Row: {
          child_id: string | null
          id: string
          order_index: number | null
          parent_id: string | null
          relationship_type: string
        }
        Insert: {
          child_id?: string | null
          id?: string
          order_index?: number | null
          parent_id?: string | null
          relationship_type: string
        }
        Update: {
          child_id?: string | null
          id?: string
          order_index?: number | null
          parent_id?: string | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_relationships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_revisions: {
        Row: {
          change_summary: string | null
          content: Json
          content_id: string | null
          created_at: string | null
          created_by: string | null
          diff: Json | null
          id: string
          metadata: Json | null
          previous_version_id: string | null
          publish_status: string | null
          rollback_from: string | null
          rollback_metadata: Json | null
          rollback_type: string | null
          scheduled_by: string | null
          scheduled_publish_at: string | null
          version_number: number | null
        }
        Insert: {
          change_summary?: string | null
          content: Json
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          diff?: Json | null
          id?: string
          metadata?: Json | null
          previous_version_id?: string | null
          publish_status?: string | null
          rollback_from?: string | null
          rollback_metadata?: Json | null
          rollback_type?: string | null
          scheduled_by?: string | null
          scheduled_publish_at?: string | null
          version_number?: number | null
        }
        Update: {
          change_summary?: string | null
          content?: Json
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          diff?: Json | null
          id?: string
          metadata?: Json | null
          previous_version_id?: string | null
          publish_status?: string | null
          rollback_from?: string | null
          rollback_metadata?: Json | null
          rollback_type?: string | null
          scheduled_by?: string | null
          scheduled_publish_at?: string | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_revisions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_revisions_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "cms_content_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_revisions_rollback_from_fkey"
            columns: ["rollback_from"]
            isOneToOne: false
            referencedRelation: "cms_content_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_revisions_scheduled_by_fkey"
            columns: ["scheduled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_tags: {
        Row: {
          content_id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          tag_id: string
        }
        Update: {
          content_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "cms_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cms_workflows: {
        Row: {
          created_by: string | null
          description: string | null
          id: string
          name: string
          steps: Json
          triggers: Json | null
          updated_at: string | null
        }
        Insert: {
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          steps: Json
          triggers?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          steps?: Json
          triggers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      erd_visualizations: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erd_visualizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_flags: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          thread_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          thread_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_flags_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_flags_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_flags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      import_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_name: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          row_count: number | null
          status: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          row_count?: number | null
          status?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          row_count?: number | null
          status?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maker_projects: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_time: string | null
          id: string
          likes_count: number | null
          parts_count: number | null
          status: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: string | null
          id?: string
          likes_count?: number | null
          parts_count?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: string | null
          id?: string
          likes_count?: number | null
          parts_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      media: {
        Row: {
          blog_post_id: string | null
          created_at: string
          id: string
          name: string
          size: number | null
          type: string | null
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          blog_post_id?: string | null
          created_at?: string
          id?: string
          name: string
          size?: number | null
          type?: string | null
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          blog_post_id?: string | null
          created_at?: string
          id?: string
          name?: string
          size?: number | null
          type?: string | null
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_auth_logs: {
        Row: {
          attempt_type: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attempt_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pin_auth_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_builds: {
        Row: {
          author_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_builds_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          failed_login_attempts: number | null
          failed_pin_attempts: number | null
          gamification_enabled: boolean | null
          id: string
          is_banned: boolean | null
          last_login_at: string | null
          last_password_login: string | null
          last_seen: string | null
          location: string | null
          lockout_until: string | null
          onboarding_completed: boolean | null
          pin_enabled: boolean | null
          pin_hash: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
          username: string | null
          visual_editor_enabled: boolean | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          failed_login_attempts?: number | null
          failed_pin_attempts?: number | null
          gamification_enabled?: boolean | null
          id: string
          is_banned?: boolean | null
          last_login_at?: string | null
          last_password_login?: string | null
          last_seen?: string | null
          location?: string | null
          lockout_until?: string | null
          onboarding_completed?: boolean | null
          pin_enabled?: boolean | null
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          visual_editor_enabled?: boolean | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          failed_login_attempts?: number | null
          failed_pin_attempts?: number | null
          gamification_enabled?: boolean | null
          id?: string
          is_banned?: boolean | null
          last_login_at?: string | null
          last_password_login?: string | null
          last_seen?: string | null
          location?: string | null
          lockout_until?: string | null
          onboarding_completed?: boolean | null
          pin_enabled?: boolean | null
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          username?: string | null
          visual_editor_enabled?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      publishing_queue: {
        Row: {
          content_id: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          id: string
          processed_at: string | null
          revision_id: string | null
          scheduled_for: string
          status: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          revision_id?: string | null
          scheduled_for: string
          status?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          revision_id?: string | null
          scheduled_for?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publishing_queue_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publishing_queue_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publishing_queue_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "cms_content_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          used: boolean | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recovery_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_history: {
        Row: {
          changes: Json
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          revision_type: string
        }
        Insert: {
          changes: Json
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          revision_type: string
        }
        Update: {
          changes?: Json
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          revision_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "revision_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          accent_color: string | null
          backdrop_blur: string | null
          border_radius: string | null
          box_shadow: string | null
          favicon_url: string | null
          font_family_body: string
          font_family_heading: string
          font_size_base: string
          font_weight_bold: string
          font_weight_normal: string
          hover_scale: string | null
          id: string
          letter_spacing: string
          line_height_base: string
          logo_url: string | null
          neon_cyan: string | null
          neon_pink: string | null
          neon_purple: string | null
          primary_color: string | null
          secondary_color: string | null
          security_settings: Json | null
          shadow_color: string | null
          site_title: string
          spacing_unit: string | null
          tagline: string | null
          text_animation_color: string | null
          text_animation_duration: string | null
          text_animation_enabled: boolean | null
          text_animation_type: string | null
          text_heading_color: string | null
          text_link_color: string | null
          text_primary_color: string | null
          text_secondary_color: string | null
          theme_mode: Database["public"]["Enums"]["theme_mode"] | null
          transition_duration: string | null
          transition_settings: Json | null
          transition_type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          accent_color?: string | null
          backdrop_blur?: string | null
          border_radius?: string | null
          box_shadow?: string | null
          favicon_url?: string | null
          font_family_body?: string
          font_family_heading?: string
          font_size_base?: string
          font_weight_bold?: string
          font_weight_normal?: string
          hover_scale?: string | null
          id?: string
          letter_spacing?: string
          line_height_base?: string
          logo_url?: string | null
          neon_cyan?: string | null
          neon_pink?: string | null
          neon_purple?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          security_settings?: Json | null
          shadow_color?: string | null
          site_title?: string
          spacing_unit?: string | null
          tagline?: string | null
          text_animation_color?: string | null
          text_animation_duration?: string | null
          text_animation_enabled?: boolean | null
          text_animation_type?: string | null
          text_heading_color?: string | null
          text_link_color?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          theme_mode?: Database["public"]["Enums"]["theme_mode"] | null
          transition_duration?: string | null
          transition_settings?: Json | null
          transition_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          accent_color?: string | null
          backdrop_blur?: string | null
          border_radius?: string | null
          box_shadow?: string | null
          favicon_url?: string | null
          font_family_body?: string
          font_family_heading?: string
          font_size_base?: string
          font_weight_bold?: string
          font_weight_normal?: string
          hover_scale?: string | null
          id?: string
          letter_spacing?: string
          line_height_base?: string
          logo_url?: string | null
          neon_cyan?: string | null
          neon_pink?: string | null
          neon_purple?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          security_settings?: Json | null
          shadow_color?: string | null
          site_title?: string
          spacing_unit?: string | null
          tagline?: string | null
          text_animation_color?: string | null
          text_animation_duration?: string | null
          text_animation_enabled?: boolean | null
          text_animation_type?: string | null
          text_heading_color?: string | null
          text_link_color?: string | null
          text_primary_color?: string | null
          text_secondary_color?: string | null
          theme_mode?: Database["public"]["Enums"]["theme_mode"] | null
          transition_duration?: string | null
          transition_settings?: Json | null
          transition_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      text_animation_presets: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          duration: string
          id: string
          name: string
          timing_function: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          duration: string
          id?: string
          name: string
          timing_function?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          duration?: string
          id?: string
          name?: string
          timing_function?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transition_presets: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string | null
          device_hash: string
          device_name: string
          expires_at: string
          id: string
          last_used: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_hash: string
          device_name: string
          expires_at: string
          id?: string
          last_used?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_hash?: string
          device_name?: string
          expires_at?: string
          id?: string
          last_used?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trusted_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          details: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_cms: {
        Row: {
          activity_type: string
          content_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_cms_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_cms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_comments: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          instance_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          instance_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_comments_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_history: {
        Row: {
          action: string
          created_at: string | null
          created_by: string | null
          id: string
          instance_id: string | null
          metadata: Json | null
        }
        Insert: {
          action: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          instance_id?: string | null
          metadata?: Json | null
        }
        Update: {
          action?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          instance_id?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_history_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_instances: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          current_stage: number | null
          id: string
          metadata: Json | null
          status: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stage?: number | null
          id?: string
          metadata?: Json | null
          status?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stage?: number | null
          id?: string
          metadata?: Json | null
          status?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
          workflow_instance_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
          workflow_instance_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
          workflow_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_notifications_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stage_validation_rules: {
        Row: {
          created_at: string | null
          id: string
          rules: Json | null
          stage_id: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rules?: Json | null
          stage_id: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rules?: Json | null
          stage_id?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stage_validation_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          notification_config: Json | null
          stage_configs: Json | null
          stage_types: Json | null
          stages: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notification_config?: Json | null
          stage_configs?: Json | null
          stage_types?: Json | null
          stages?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notification_config?: Json | null
          stage_configs?: Json | null
          stage_types?: Json | null
          stages?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_blog_image: {
        Args: {
          post_id: string
          image_url: string
        }
        Returns: undefined
      }
      ban_user: {
        Args: {
          user_id: string
          reason: string
          admin_id: string
        }
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_max_count: number
          p_time_window: string
        }
        Returns: boolean
      }
      create_rollback_revision: {
        Args: {
          p_content_id: string
          p_target_version_number: number
          p_current_content: Json
          p_user_id: string
        }
        Returns: string
      }
      initialize_user_gamification: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      record_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_details: string
          p_metadata?: Json
        }
        Returns: string
      }
      resend_2fa_code: {
        Args: {
          p_email: string
        }
        Returns: undefined
      }
      reset_pin_lockout: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      setup_pin: {
        Args: {
          p_user_id: string
          p_pin: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: Json
      }
      update_site_settings:
        | {
            Args: {
              p_font_family_heading?: string
              p_font_family_body?: string
              p_font_size_base?: string
              p_font_weight_normal?: string
              p_font_weight_bold?: string
              p_line_height_base?: string
              p_letter_spacing?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_site_title?: string
              p_tagline?: string
              p_primary_color?: string
              p_secondary_color?: string
              p_accent_color?: string
              p_logo_url?: string
              p_favicon_url?: string
              p_theme_mode?: Database["public"]["Enums"]["theme_mode"]
            }
            Returns: Json
          }
        | {
            Args: {
              p_site_title?: string
              p_tagline?: string
              p_primary_color?: string
              p_secondary_color?: string
              p_accent_color?: string
              p_logo_url?: string
              p_favicon_url?: string
              p_theme_mode?: Database["public"]["Enums"]["theme_mode"]
              p_text_primary_color?: string
              p_text_secondary_color?: string
              p_text_link_color?: string
              p_text_heading_color?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_site_title?: string
              p_tagline?: string
              p_primary_color?: string
              p_secondary_color?: string
              p_accent_color?: string
              p_logo_url?: string
              p_favicon_url?: string
              p_theme_mode?: Database["public"]["Enums"]["theme_mode"]
              p_text_primary_color?: string
              p_text_secondary_color?: string
              p_text_link_color?: string
              p_text_heading_color?: string
              p_neon_cyan?: string
              p_neon_pink?: string
              p_neon_purple?: string
              p_border_radius?: string
              p_spacing_unit?: string
              p_transition_duration?: string
              p_shadow_color?: string
              p_hover_scale?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_site_title?: string
              p_tagline?: string
              p_primary_color?: string
              p_secondary_color?: string
              p_accent_color?: string
              p_logo_url?: string
              p_favicon_url?: string
              p_theme_mode?: Database["public"]["Enums"]["theme_mode"]
              p_text_primary_color?: string
              p_text_secondary_color?: string
              p_text_link_color?: string
              p_text_heading_color?: string
              p_neon_cyan?: string
              p_neon_pink?: string
              p_neon_purple?: string
              p_border_radius?: string
              p_spacing_unit?: string
              p_transition_duration?: string
              p_shadow_color?: string
              p_hover_scale?: string
              p_font_family_heading?: string
              p_font_family_body?: string
              p_font_size_base?: string
              p_font_weight_normal?: string
              p_font_weight_bold?: string
              p_line_height_base?: string
              p_letter_spacing?: string
            }
            Returns: Json
          }
      verify_2fa_code: {
        Args: {
          p_code: string
          p_email: string
        }
        Returns: Json
      }
      verify_pin_login: {
        Args: {
          p_user_id: string
          p_pin: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: Json
      }
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      content_type: "page" | "component" | "template" | "workflow"
      post_category:
        | "Guides"
        | "Reviews"
        | "Blog"
        | "Site Updates"
        | "Critical"
        | "3D Printer"
        | "3D Printer Hardware"
      theme_mode: "light" | "dark" | "system"
      user_role: "subscriber" | "maker" | "admin" | "super_admin"
      workflow_stage_type:
        | "approval"
        | "review"
        | "task"
        | "notification"
        | "conditional"
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
