
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
    <div className="min-h-screen">
      <MainNav />
      
      <div className="container mx-auto p-6 space-y-8 pt-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your application settings and data</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4 bg-background p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
              <Database className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/10">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/10">
              <Table className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-primary/10">
              <Import className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <ImportTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
