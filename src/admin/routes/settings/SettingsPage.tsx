
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Lock, Palette, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">General Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">
                    Admin Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about important admin events
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave" className="text-base">
                    Auto-save Changes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes when editing
                  </p>
                </div>
                <Switch id="autoSave" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics" className="text-base">
                    Analytics Collection
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Collect anonymous usage data to improve the admin panel
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Security Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa" className="text-base">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin access
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sessionTimeout" className="text-base">
                    Session Timeout
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                <Switch id="sessionTimeout" defaultChecked />
              </div>
              
              <Button variant="outline" className="mt-4">
                <Lock className="w-4 h-4 mr-2" />
                Security Audit Log
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Appearance Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-base">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for admin panel
                  </p>
                </div>
                <Switch id="darkMode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compactMode" className="text-base">
                    Compact Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing in the admin interface
                  </p>
                </div>
                <Switch id="compactMode" />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">System Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode
                  </p>
                </div>
                <Switch id="maintenance" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="caching" className="text-base">
                    Content Caching
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable content caching for better performance
                  </p>
                </div>
                <Switch id="caching" defaultChecked />
              </div>
              
              <Button variant="destructive" className="mt-4">
                Clear System Cache
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
