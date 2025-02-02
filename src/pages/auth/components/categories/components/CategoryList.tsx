import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const CategoryList = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_categories')  // Updated to use correct table name
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {categories?.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
};

export default CategoryList;