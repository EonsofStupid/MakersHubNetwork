import type { TableDefinition } from './base';

export type Database = {
  public: {
    Tables: {
      blog_posts: TableDefinition<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        published_at: string | null;
        updated_at: string | null;
        status: string | null;
        author_id: string | null;
        featured_image: string | null;
        views_count: number | null;
      }>;
      maker_projects: TableDefinition<{
        id: string;
        title: string;
        description: string | null;
        category: string;
        difficulty_level: string | null;
        estimated_time: string | null;
        parts_count: number | null;
        created_at: string | null;
        updated_at: string | null;
        status: string | null;
        views_count: number | null;
        likes_count: number | null;
      }>;
      media: TableDefinition<{
        id: string;
        name: string;
        url: string;
        type: string | null;
        size: number | null;
        created_at: string;
        updated_at: string;
        user_id: string | null;
      }>;
      profiles: TableDefinition<{
        id: string;
        username: string | null;
        display_name: string | null;
        avatar_url: string | null;
        role: Database["public"]["Enums"]["user_role"] | null;
        bio: string | null;
        website: string | null;
        location: string | null;
        created_at: string;
        updated_at: string;
        last_seen: string | null;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "subscriber" | "maker" | "admin" | "super_admin";
    };
    CompositeTypes: Record<string, never>;
  };
};