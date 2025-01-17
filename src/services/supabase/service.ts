import { supabase } from '@/integrations/supabase/client';
import type { 
  TableName, 
  Row, 
  Insert, 
  Update, 
  ServiceResponse,
  QueryOptions,
  SubscriptionCallback,
  Tables
} from './types';
import { PostgrestError } from '@supabase/supabase-js';

export class SupabaseService {
  private channels: ReturnType<typeof supabase.channel>[] = [];

  async getAll<T extends TableName>(
    table: T,
    options?: QueryOptions
  ): Promise<ServiceResponse<Row<T>[]>> {
    try {
      let query = supabase.from(table).select(options?.columns || '*');

      if (options?.filter) {
        query = query.match(options.filter);
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return {
        data: data as Row<T>[],
        error: null,
        status: 200
      };
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        status: 400
      };
    }
  }

  async getById<T extends TableName>(
    table: T,
    id: string
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      return {
        data: data as Row<T>,
        error: null,
        status: 200
      };
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        status: 400
      };
    }
  }

  async create<T extends TableName>(
    table: T,
    data: Insert<T>
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: created, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: created as Row<T>,
        error: null,
        status: 201
      };
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        status: 400
      };
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
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: updated as Row<T>,
        error: null,
        status: 200
      };
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        status: 400
      };
    }
  }

  async delete<T extends TableName>(
    table: T,
    id: string
  ): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: deleted, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: deleted as Row<T>,
        error: null,
        status: 200
      };
    } catch (error) {
      return {
        data: null,
        error: error as PostgrestError,
        status: 400
      };
    }
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