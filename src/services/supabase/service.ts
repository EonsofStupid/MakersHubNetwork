import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { 
  TableName, 
  Row, 
  Insert, 
  Update, 
  ServiceResponse,
  QueryOptions,
  SubscriptionCallback
} from './types';

export class SupabaseService {
  private channels: ReturnType<typeof supabase.channel>[] = [];

  async getAll<T extends TableName>(
    table: T,
    options?: QueryOptions
  ): Promise<ServiceResponse<Row<T>[]>> {
    let query = supabase.from(table).select(options?.columns || '*');

    if (options?.filter) {
      query = query.match(options.filter);
    }

    const { data, error } = await query;
    
    return {
      data: data as Row<T>[] | null,
      error: error,
      status: error ? 400 : 200
    };
  }

  async getById<T extends TableName>(
    table: T,
    id: string,
    columns?: string
  ): Promise<ServiceResponse<Row<T>>> {
    const { data, error } = await supabase
      .from(table)
      .select(columns || '*')
      .eq('id', id)
      .single();

    return {
      data: data as Row<T> | null,
      error: error,
      status: error ? 400 : 200
    };
  }

  async create<T extends TableName>(
    table: T,
    data: Insert<T>
  ): Promise<ServiceResponse<Row<T>>> {
    const { data: created, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    return {
      data: created as Row<T> | null,
      error: error,
      status: error ? 400 : 201
    };
  }

  async update<T extends TableName>(
    table: T,
    id: string,
    data: Update<T>
  ): Promise<ServiceResponse<Row<T>>> {
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    return {
      data: updated as Row<T> | null,
      error: error,
      status: error ? 400 : 200
    };
  }

  async delete<T extends TableName>(
    table: T,
    id: string
  ): Promise<ServiceResponse<Row<T>>> {
    const { data: deleted, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();

    return {
      data: deleted as Row<T> | null,
      error: error,
      status: error ? 400 : 200
    };
  }

  subscribe<T extends TableName>(
    table: T,
    callback: SubscriptionCallback<T>
  ) {
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload: any) => {
          callback({
            new: payload.new as Row<T>,
            old: payload.old as Row<T> | null,
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          });
        }
      )
      .subscribe();

    this.channels.push(channel);
    return channel;
  }

  cleanup() {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels = [];
  }
}

export const supabaseService = new SupabaseService();