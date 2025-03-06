
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading">
            <SimpleCyberText text="Admin Settings" />
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">Configure global system settings</p>
      </Card>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings configuration will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
