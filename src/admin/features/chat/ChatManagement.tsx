
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Chat Management</h2>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>Chat Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chat management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatManagement;
