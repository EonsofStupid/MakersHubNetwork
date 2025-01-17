import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase/service';
import type { TableName, Row, Insert, Update, QueryOptions } from '@/services/supabase/types';

export function useSupabase<T extends TableName>(table: T) {
  const queryClient = useQueryClient();

  const getAll = (options?: QueryOptions) => {
    return useQuery({
      queryKey: [table, options],
      queryFn: () => supabaseService.getAll<T>(table, options)
    });
  };

  const getById = (id: string) => {
    return useQuery({
      queryKey: [table, id],
      queryFn: () => supabaseService.getById<T>(table, id)
    });
  };

  const create = () => {
    return useMutation({
      mutationFn: (data: Insert<T>) => supabaseService.create<T>(table, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      }
    });
  };

  const update = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Update<T> }) =>
        supabaseService.update<T>(table, id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      }
    });
  };

  const remove = () => {
    return useMutation({
      mutationFn: (id: string) => supabaseService.delete<T>(table, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      }
    });
  };

  const subscribe = (callback: (payload: {
    new: Row<T>;
    old: Row<T> | null;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => void) => {
    useEffect(() => {
      const subscription = supabaseService.subscribe(table, callback);
      return () => {
        subscription.unsubscribe();
      };
    }, []);
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    subscribe
  };
}