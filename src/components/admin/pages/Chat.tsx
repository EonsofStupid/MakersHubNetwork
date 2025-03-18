
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Save, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/stores/admin/store";

const Chat = () => {
  const { toast } = useToast();
  const { hasPermission } = useAdminStore();
  
  const [chatEnabled, setChatEnabled] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to MakersImpulse chat! How can I help you with your 3D printing projects today?");
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Chat configuration has been updated successfully."
    });
  };

  if (!hasPermission("admin:access")) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to manage chat settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading cyber-text-glow">Chat Management</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cyber-card border-primary/20">
          <CardHeader>
            <CardTitle>Chat Configuration</CardTitle>
            <CardDescription>
              Control chat functionality and visibility throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="chat-enabled">Enable Chat System</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle to enable or disable the chat functionality globally.
                  </p>
                </div>
                <Switch
                  id="chat-enabled"
                  checked={chatEnabled}
                  onCheckedChange={setChatEnabled}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Input
                  id="welcome-message"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Enter welcome message for chat"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be shown to users when they first open the chat window.
                </p>
              </div>
              
              <Button className="w-full" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card border-primary/20">
          <CardHeader>
            <CardTitle>Chat Statistics</CardTitle>
            <CardDescription>
              Overview of chat usage and performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-2xl font-bold">4.2m</p>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
