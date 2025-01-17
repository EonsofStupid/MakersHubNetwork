import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import type { 
  TableName, 
  Row, 
  Insert, 
  Update, 
  ServiceResponse,
  QueryOptions 
} from '@/types/supabase/database.types';

export class BaseService<T extends TableName> {
  constructor(protected table: T) {}

  protected createQuery() {
    return supabase.from(this.table);
  }

  protected handleError(error: PostgrestError | Error): ServiceResponse<any> {
    console.error(`Error in ${this.table}:`, error);
    return {
      data: null,
      error,
      status: error instanceof PostgrestError ? error.code : 500
    };
  }

  async getAll(options?: QueryOptions): Promise<ServiceResponse<Row<T>[]>> {
    try {
      let query = this.createQuery().select(options?.columns || '*');

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

  async getById(id: string): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data, error } = await this.createQuery()
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

  async create(data: Insert<T>): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: created, error } = await this.createQuery()
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

  async update(id: string, data: Update<T>): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: updated, error } = await this.createQuery()
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

  async delete(id: string): Promise<ServiceResponse<Row<T>>> {
    try {
      const { data: deleted, error } = await this.createQuery()
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