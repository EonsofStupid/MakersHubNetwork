import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SiteMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['site-metrics'],
    queryFn: async () => {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id');
      
      const { data: users } = await supabase
        .from('profiles')
        .select('id');

      return {
        totalPosts: posts?.length || 0,
        totalUsers: users?.length || 0
      };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground">Total Posts</h4>
        <p className="text-2xl font-bold">{metrics?.totalPosts || 0}</p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground">Total Users</h4>
        <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
      </Card>
    </div>
  );
};

export default SiteMetrics;