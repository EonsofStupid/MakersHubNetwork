
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Admin Settings</h2>
      
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

export default Settings;
