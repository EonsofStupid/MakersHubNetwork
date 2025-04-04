import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { AppearanceSettings } from '@/components/profile/AppearanceSettings';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { useThemeStore } from '@/stores/theme/store';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function Settings() {
  const logger = useLogger('SettingsPage', { category: LogCategory.SYSTEM });
  const { currentTheme } = useThemeStore();
  
  return (
    <RequireAuth>
      <AppLayout title="Settings">
        <div className="container mx-auto py-10">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account settings and set preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <ProfileSettings />
                </TabsContent>
                <TabsContent value="account">
                  <AccountSettings />
                </TabsContent>
                <TabsContent value="appearance">
                  <AppearanceSettings />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </RequireAuth>
  );
}
