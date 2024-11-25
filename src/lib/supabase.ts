import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function uploadFile(file: File, bucket: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) throw error;
  return data;
}

export async function importData(data: any[], table: string) {
  const { error } = await supabase
    .from(table)
    .insert(data);

  if (error) throw error;
}