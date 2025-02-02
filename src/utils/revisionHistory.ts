import { supabase } from "@/integrations/supabase/client";

interface UserResponse {
  data: {
    user: {
      id: string;
      email: string;
    };
  };
}

export const getRevisionAuthor = async (userId: string) => {
  try {
    const response = await supabase.auth.getUser();
    return response.data.user;
  } catch (error) {
    console.error("Error fetching revision author:", error);
    return null;
  }
}

export const getRevisionHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('revision_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching revision history:", error);
    return [];
  }
}

export const addRevision = async (revision: any) => {
  try {
    const { error } = await supabase
      .from('revision_history')
      .insert([revision]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error adding revision:", error);
  }
}