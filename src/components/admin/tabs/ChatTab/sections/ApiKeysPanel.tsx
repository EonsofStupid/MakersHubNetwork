
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Key } from 'lucide-react';

export const ApiKeysPanel = () => {
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              API Keys Management
            </CardTitle>
            <CardDescription>
              Manage API keys for OpenAI, Stability AI and other services
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsCreatingKey(true)}
            className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
            <Plus className="w-4 h-4 mr-2" />
            Add New Key
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <Key className="w-12 h-12 mb-4 opacity-20" />
          <p>No API keys configured yet.</p>
          <p className="max-w-md text-sm mt-2">
            Add your first API key to start using AI services like OpenAI, Stability AI, or Replicate.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsCreatingKey(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
