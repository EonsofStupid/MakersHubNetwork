import { supabase } from './client';
import { Row, Insert, Update, TableName, ServiceResponse, QueryOptions } from './types';

export class SupabaseService<T extends TableName> {
  constructor(protected readonly table: T) {}

  async getAll(options?: QueryOptions): Promise<ServiceResponse<Row<T>[]>> {
    try {
      let query = supabase.from(this.table).select('*');

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      return {
        data: data as Row<T>[],
        error: error as Error | null,
        status: error ? 400 : 200,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        status: 500,
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data as Row<T>,
        error: error as Error | null,
        status: error ? 400 : 200,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        status: 500,
      };
    }
  }

  async create(item: Insert<T>): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert(item)
        .select()
        .single();

      return {
        data: data as Row<T>,
        error: error as Error | null,
        status: error ? 400 : 201,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        status: 500,
      };
    }
  }

  async update(id: string, item: Update<T>): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update(item)
        .eq('id', id)
        .select()
        .single();

      return {
        data: data as Row<T>,
        error: error as Error | null,
        status: error ? 400 : 200,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        status: 500,
      };
    }
  }

  async delete(id: string): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      return {
        data: data as Row<T>,
        error: error as Error | null,
        status: error ? 400 : 200,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        status: 500,
      };
    }
  }
}