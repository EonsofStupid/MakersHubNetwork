
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { OverviewTab } from '@/admin/tabs/OverviewTab';
import { UsersTab } from '@/admin/tabs/UsersTab';
import { ImportTab } from '@/admin/tabs/ImportTab';
import { SettingsTab } from '@/admin/tabs/SettingsTab';
import { DataMaestroTab } from '@/admin/tabs/DataMaestroTab';
import { lazy, Suspense } from "react";

const ContentTab = lazy(() => import("@/admin/tabs/ContentTab"));
const ChatTab = lazy(() => import("@/admin/tabs/ChatTab"));

const AdminPanel = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-heading cyber-text-glow">Admin Panel</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <Card className="cyber-card border-primary/20">
          <TabsList className="w-full justify-start border-b border-primary/20 rounded-none px-4">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="data-maestro"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Data Maestro
            </TabsTrigger>
            <TabsTrigger 
              value="import"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Import
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="content">
          <Suspense fallback={<div className="min-h-[600px] flex items-center justify-center">Loading content management...</div>}>
            <ContentTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="chat">
          <Suspense fallback={<div className="min-h-[600px] flex items-center justify-center">Loading chat management...</div>}>
            <ChatTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="data-maestro">
          <DataMaestroTab />
        </TabsContent>
        
        <TabsContent value="import">
          <ImportTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
