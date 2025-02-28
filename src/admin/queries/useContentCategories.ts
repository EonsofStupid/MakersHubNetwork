
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { adminKeys } from "@/admin/types/queries"

// Export the needed hook functions that are referenced in CategoryManagement.tsx
export const useCategories = () => {
  return useQuery({
    queryKey: [...adminKeys.all, 'categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    }
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (categoryData: { name: string, slug: string }) => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert([categoryData])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...adminKeys.all, 'categories']
      })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, name, slug }: { id: string, name: string, slug: string }) => {
      const { data, error } = await supabase
        .from('content_categories')
        .update({ name, slug })
        .eq('id', id)
        .select()

      if (error) throw error
      return data ? data[0] : null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'categories'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'categories'] })
    },
  })
}
