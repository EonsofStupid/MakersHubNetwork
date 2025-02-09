
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Import, Settings, Table, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { OverviewTab } from '@/features/admin/components/tabs/OverviewTab';
import { ImportTab } from '@/features/admin/components/tabs/ImportTab';
import { UsersTab } from '@/features/admin/components/tabs/UsersTab';
import { ContentTab } from '@/features/admin/components/tabs/ContentTab';
import { SettingsTab } from '@/features/admin/components/tabs/SettingsTab';
import { MainNav } from '@/components/MainNav';
import { motion } from 'framer-motion';

const Admin = () => {
  // Set up real-time subscription for updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Refetch all queries when any relevant table changes
        // The individual components will handle their own refetching
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MainNav />
      
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              mixBlendMode: 'screen',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-8 pt-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent relative group">
              Admin Dashboard
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-primary via-white to-secondary" />
            </h1>
            <p className="text-muted-foreground mt-2">Manage your application settings and data</p>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-5 gap-4 p-1 neo-blur rounded-lg backdrop-blur-xl border border-primary/20">
            {[
              { value: 'overview', icon: Database, label: 'Overview' },
              { value: 'users', icon: Users, label: 'Users' },
              { value: 'content', icon: Table, label: 'Content' },
              { value: 'import', icon: Import, label: 'Import' },
              { value: 'settings', icon: Settings, label: 'Settings' }
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger 
                key={value}
                value={value} 
                className="relative group data-[state=active]:glass-morphism"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur transition-opacity duration-300" />
                <Icon className="w-4 h-4 mr-2 group-data-[state=active]:text-primary" />
                <span className="relative z-10">{label}</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-primary to-secondary" />
              </TabsTrigger>
            ))}
          </TabsList>

          {[
            { value: 'overview', component: OverviewTab },
            { value: 'import', component: ImportTab },
            { value: 'users', component: UsersTab },
            { value: 'content', component: ContentTab },
            { value: 'settings', component: SettingsTab }
          ].map(({ value, component: Component }) => (
            <TabsContent 
              key={value}
              value={value} 
              className="relative space-y-4 min-h-[400px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Component />
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
