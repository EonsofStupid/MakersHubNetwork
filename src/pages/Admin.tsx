
import { Suspense, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FileText, Settings, Table, Users, Wand2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from '@/components/MainNav';
import { motion } from 'framer-motion';
import { adminRoutes, AdminTabKey } from '@/admin/routes/admin.routes';
import { Card } from '@/components/ui/card';

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

  const renderTabContent = (tabKey: AdminTabKey) => {
    const TabComponent = adminRoutes[tabKey];
    return (
      <Suspense fallback={
        <Card className="p-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </Card>
      }>
        <TabComponent />
      </Suspense>
    );
  };

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
          <TabsList className="grid grid-cols-6 gap-4 p-1 neo-blur rounded-lg backdrop-blur-xl border border-primary/20">
            {[
              { value: 'overview', icon: Database, label: 'Overview' },
              { value: 'users', icon: Users, label: 'Users' },
              { value: 'content', icon: FileText, label: 'Content' },
              { value: 'data-maestro', icon: Wand2, label: 'Data Maestro' },
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

          <TabsContent value="overview">
            {renderTabContent('overview')}
          </TabsContent>
          <TabsContent value="users">
            {renderTabContent('users')}
          </TabsContent>
          <TabsContent value="content">
            {renderTabContent('content')}
          </TabsContent>
          <TabsContent value="data-maestro">
            {renderTabContent('dataMaestro')}
          </TabsContent>
          <TabsContent value="settings">
            {renderTabContent('settings')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
