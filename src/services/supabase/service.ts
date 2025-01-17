import { supabase } from '@/integrations/supabase/client';
import { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
import { TableName, Row, Insert, Update, ServiceResponse, SubscriptionCallback, QueryOptions, Tables } from './types';

export class SupabaseService {
  private static instance: SupabaseService;
  private activeSubscriptions: Map<string, RealtimeChannel>;

  private constructor() {
    this.activeSubscriptions = new Map();
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  private handleError(error: PostgrestError | null): ServiceResponse<null> {
    if (!error) return { data: null, error: null, status: 200 };
    console.error('Supabase error:', error);
    return {
      data: null,
      error,
      status: error?.code === 'PGRST116' ? 404 : 500,
    };
  }

  async getAll<T extends TableName>(
    table: T,
    options?: QueryOptions
  ): Promise<ServiceResponse<Row<T>[]>> {
    try {
      let query = supabase.from(table).select(options?.columns || '*');

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: data as Row<T>[],
        error: null,
        status: 200,
      };
    } catch (error) {
      return this.handleError(error as PostgrestError);
    }
  }

  async getOne<T extends TableName>(
    table: T,
    id: string,
    columns?: string
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(columns || '*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      return {
        data: data as Row<T>,
        error: null,
        status: 200,
      };
    } catch (error) {
      return this.handleError(error as PostgrestError);
    }
  }

  async insert<T extends TableName>(
    table: T,
    data: Insert<T>
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(data as Tables[T]['Insert'])
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: inserted as Row<T>,
        error: null,
        status: 201,
      };
    } catch (error) {
      return this.handleError(error as PostgrestError);
    }
  }

  async update<T extends TableName>(
    table: T,
    id: string,
    data: Update<T>
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: updated, error } = await supabase
        .from(table)
        .update(data as Tables[T]['Update'])
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: updated as Row<T>,
        error: null,
        status: 200,
      };
    } catch (error) {
      return this.handleError(error as PostgrestError);
    }
  }

  async delete<T extends TableName>(
    table: T,
    id: string
  ): Promise<ServiceResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        data: null,
        error: null,
        status: 204,
      };
    } catch (error) {
      return this.handleError(error as PostgrestError);
    }
  }

  subscribe<T extends TableName>(
    table: T,
    callback: SubscriptionCallback<T>,
    filter?: Record<string, any>
  ): () => void {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          callback({
            new: payload.new as Row<T>,
            old: payload.old as Row<T> | null,
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          });
        }
      )
      .subscribe();

    const subscriptionKey = `${table}-${Date.now()}`;
    this.activeSubscriptions.set(subscriptionKey, channel);

    return () => {
      channel.unsubscribe();
      this.activeSubscriptions.delete(subscriptionKey);
    };
  }

  async cleanup(): Promise<void> {
    for (const [key, channel] of this.activeSubscriptions) {
      await channel.unsubscribe();
      this.activeSubscriptions.delete(key);
    }
  }
}

export const supabaseService = SupabaseService.getInstance();