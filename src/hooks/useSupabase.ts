import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabase/service';
import { TableName, Row, Insert, Update, ServiceResponse } from '@/services/supabase/types';
import { useToast } from '@/components/ui/use-toast';

export function useSupabase<T extends TableName>(table: T) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleError = (error: any) => {
    toast({
      title: 'Error',
      description: error.message || 'An error occurred',
      variant: 'destructive',
    });
  };

  const getAll = async (options?: { columns?: string; filter?: Record<string, any> }) => {
    setIsLoading(true);
    try {
      return await supabaseService.getAll(table, options);
    } catch (error) {
      handleError(error);
      return { data: null, error, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const getOne = async (id: string, columns?: string) => {
    setIsLoading(true);
    try {
      return await supabaseService.getOne(table, id, columns);
    } catch (error) {
      handleError(error);
      return { data: null, error, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const insert = async (data: Insert<T>) => {
    setIsLoading(true);
    try {
      return await supabaseService.insert(table, data);
    } catch (error) {
      handleError(error);
      return { data: null, error, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: Update<T>) => {
    setIsLoading(true);
    try {
      return await supabaseService.update(table, id, data);
    } catch (error) {
      handleError(error);
      return { data: null, error, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    setIsLoading(true);
    try {
      return await supabaseService.delete(table, id);
    } catch (error) {
      handleError(error);
      return { data: null, error, status: 500 };
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = (callback: (payload: {
    new: Row<T>;
    old: Row<T> | null;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => void, filter?: Record<string, any>) => {
    return supabaseService.subscribe(table, callback, filter);
  };

  useEffect(() => {
    return () => {
      supabaseService.cleanup();
    };
  }, []);

  return {
    isLoading,
    getAll,
    getOne,
    insert,
    update,
    remove,
    subscribe,
  };
}