import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Activity, Zap, Radio, Cpu } from 'lucide-react';
import { cn } from "@/lib/utils";

const fetchStats = async () => {
  const [users, posts, activity] = await Promise.all([
    supabase.from('profiles').select('count').single(),
    supabase.from('blog_posts').select('count').single(),
    supabase.from('user_activity').select('count').single()
  ]);

  return {
    users: users.data?.count || 0,
    posts: posts.data?.count || 0,
    activity: activity.data?.count || 0,
    performance: 98.5,
    system: 'Optimal',
    monitoring: 'Active'
  };
};

export const StatsCards = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    refetchInterval: 30000
  });

  const cards = [
    { 
      title: 'Total Users', 
      value: stats?.users || 0,
      icon: Users,
      gradient: 'from-[#41f0db]/20 to-[#41f0db]/5'
    },
    { 
      title: 'Total Posts', 
      value: stats?.posts || 0,
      icon: FileText,
      gradient: 'from-[#ff0abe]/20 to-[#ff0abe]/5'
    },
    { 
      title: 'User Activities', 
      value: stats?.activity || 0,
      icon: Activity,
      gradient: 'from-[#8000ff]/20 to-[#8000ff]/5'
    },
    { 
      title: 'Performance', 
      value: `${stats?.performance || 0}%`,
      icon: Zap,
      gradient: 'from-[#41f0db]/20 to-[#ff0abe]/5'
    },
    { 
      title: 'System Status', 
      value: stats?.system || 'Loading...',
      icon: Cpu,
      gradient: 'from-[#ff0abe]/20 to-[#8000ff]/5'
    },
    { 
      title: 'Monitoring', 
      value: stats?.monitoring || 'Loading...',
      icon: Radio,
      gradient: 'from-[#8000ff]/20 to-[#41f0db]/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "stat-card group",
              "before:absolute before:inset-0 before:bg-gradient-to-br",
              "before:opacity-10 before:transition-opacity before:duration-300",
              "before:hover:opacity-20",
              card.gradient
            )}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-lg bg-gradient-to-br",
                  card.gradient
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white group-hover:text-[#41f0db] transition-colors">
                    {isLoading ? (
                      <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
                    ) : (
                      card.value.toLocaleString()
                    )}
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};