import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuerySettingsTab } from './tabs/QuerySettingsTab';
import { RedisSettingsTab } from './tabs/RedisSettingsTab';
import { ThemeSettingsTab } from './tabs/ThemeSettingsTab';
import { SecuritySettingsTab } from './tabs/SecuritySettingsTab';
import { ContentSettingsTab } from './tabs/ContentSettingsTab';
import { ActivitySettingsTab } from './tabs/ActivitySettingsTab';
import { motion } from "framer-motion";

export const SettingsDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gray-800/50 border border-white/10 backdrop-blur-sm">
        <Tabs defaultValue="query" className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <TabsTrigger value="query">Query & Cache</TabsTrigger>
            <TabsTrigger value="redis">Redis</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-4">
            <QuerySettingsTab />
          </TabsContent>

          <TabsContent value="redis" className="space-y-4">
            <RedisSettingsTab />
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <ThemeSettingsTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettingsTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentSettingsTab />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ActivitySettingsTab />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};