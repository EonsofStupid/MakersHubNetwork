
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save, Zap, Palette, Bell, Lock, Database } from "lucide-react";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Admin Settings" />
        </h2>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="cyber-card border-primary/20">
          <CardHeader className="border-b border-primary/10 bg-primary/5">
            <CardTitle className="text-gradient flex items-center gap-2">
              <Zap className="h-5 w-5" /> System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 bg-primary/5 rounded-lg p-1 mb-6">
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  Security
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input 
                      id="site-name" 
                      placeholder="MakersImpulse" 
                      defaultValue="MakersImpulse"
                      className="border-primary/20 focus-visible:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Input 
                      id="site-description" 
                      placeholder="A community for 3D printer enthusiasts"
                      defaultValue="A hub for passionate makers building and customizing 3D printers"
                      className="border-primary/20 focus-visible:ring-primary/30"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Put the site in maintenance mode
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base">Cyber Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable the cyberpunk-inspired UI theme
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="grid gap-2">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {["#00F0FF", "#FF2D6E", "#8B5CF6", "#10B981", "#F97316"].map(color => (
                      <div 
                        key={color}
                        className="h-10 rounded-md cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for system events
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base">Database Backups</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications for scheduled backups
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-primary/20 p-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin users
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Input 
                    id="password-policy" 
                    defaultValue="8"
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum password length in characters
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SettingsManager;
