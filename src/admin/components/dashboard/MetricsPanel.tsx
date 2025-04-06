
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function MetricsPanel() {
  const logger = useLogger('MetricsPanel', LogCategory.ADMIN);

  React.useEffect(() => {
    logger.info('Metrics panel component mounted');
    return () => {
      logger.info('Metrics panel component unmounted');
    };
  }, [logger]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed system metrics will be displayed here</p>
          <div className="mt-4 h-40 bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Metrics chart placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
