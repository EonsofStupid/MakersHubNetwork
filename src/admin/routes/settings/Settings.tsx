
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Configure your admin panel preferences
          </p>
          
          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <h3 className="font-medium mb-1">Theme Settings</h3>
              <p className="text-sm text-muted-foreground">
                Customize the admin theme and appearance
              </p>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <h3 className="font-medium mb-1">Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Configure admin roles and permissions
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
