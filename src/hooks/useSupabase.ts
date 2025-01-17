import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableName, Row, Insert, Update, QueryOptions } from '@/integrations/supabase/types';

export function useSupabase<T extends TableName>(table: T) {
  const queryClient = useQueryClient();

  const getAll = (options?: QueryOptions) => {
    return useQuery({
      queryKey: [table, options],
      queryFn: () => supabase.from(table).select('*').then(({ data, error }) => {
        if (error) throw error;
        return data as Row<T>[];
      }),
    });
  };

  const getById = (id: string) => {
    return useQuery({
      queryKey: [table, id],
      queryFn: () => supabase.from(table).select('*').eq('id', id).single().then(({ data, error }) => {
        if (error) throw error;
        return data as Row<T>;
      }),
    });
  };

  const create = () => {
    return useMutation({
      mutationFn: (data: Insert<T>) => supabase.from(table).insert(data).then(({ data, error }) => {
        if (error) throw error;
        return data as Row<T>;
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      },
    });
  };

  const update = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Update<T> }) =>
        supabase.from(table).update(data).eq('id', id).then(({ data, error }) => {
          if (error) throw error;
          return data as Row<T>;
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      },
    });
  };

  const remove = () => {
    return useMutation({
      mutationFn: (id: string) => supabase.from(table).delete().eq('id', id).then(({ data, error }) => {
        if (error) throw error;
        return data as Row<T>;
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
      },
    });
  };

  const subscribe = (callback: (payload: {
    new: Row<T>;
    old: Row<T> | null;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => void) => {
    useEffect(() => {
      const subscription = supabase.from(table).on('*', callback).subscribe();
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
    subscribe,
  };
}
