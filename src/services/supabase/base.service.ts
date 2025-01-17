import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import type { 
  TableName, 
  Row, 
  Insert, 
  Update, 
  QueryResponse,
  QueryOptions 
} from '@/types/supabase';

export class BaseService<T extends TableName> {
  constructor(protected table: T) {}

  protected handleError(error: PostgrestError | Error): QueryResponse<any> {
    console.error(`Error in ${this.table}:`, error);
    return {
      data: null,
      error,
      status: error instanceof PostgrestError ? error.code : 500
    };
  }

  async getAll(options?: QueryOptions): Promise<QueryResponse<Row<T>[]>> {
    try {
      let query = supabase.from(this.table).select(options?.columns || '*');

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
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<QueryResponse<Row<T>>> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      return {
        data,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(data: Insert<T>): Promise<QueryResponse<Row<T>>> {
    try {
      const { data: created, error } = await supabase
        .from(this.table)
        .insert(data)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: created,
        error: null,
        status: 201
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, data: Update<T>): Promise<QueryResponse<Row<T>>> {
    try {
      const { data: updated, error } = await supabase
        .from(this.table)
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: updated,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<QueryResponse<Row<T>>> {
    try {
      const { data: deleted, error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        data: deleted,
        error: null,
        status: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}