import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './client';
import type { Tables, InsertTables, UpdateTables } from './types';

export class SupabaseService<T extends keyof Tables> {
  constructor(private readonly table: T) {}

  async getAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select('*');

    if (error) throw error;
    return data as Tables<T>[];
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Tables<T>;
  }

  async create(record: InsertTables<T>) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data as Tables<T>;
  }

  async update(id: string, record: UpdateTables<T>) {
    const { data, error } = await supabase
      .from(this.table)
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Tables<T>;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async query() {
    return supabase.from(this.table);
  }
}

export type SupabaseError = PostgrestError;