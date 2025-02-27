
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const UsagePanel = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Usage Analytics
        </CardTitle>
        <CardDescription>
          Track AI service usage and monitor costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-10 text-center text-muted-foreground">
          <p>Usage analytics will be displayed here.</p>
          <p className="text-sm mt-2">
            This panel will show charts of API usage, token consumption, and estimated costs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
