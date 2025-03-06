
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { MessageSquare } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading">
            <SimpleCyberText text="Chat Management" />
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">Configure and monitor chat features</p>
      </Card>
      
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

export default ChatPage;
