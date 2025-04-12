
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Rocket } from 'lucide-react';

export interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/**
 * Placeholder page component for features under development
 */
export function PlaceholderPage({ title, description, icon = <Rocket className="h-6 w-6" /> }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm border border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This feature is planned for a future update. Check back later!
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Remind me when available
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
