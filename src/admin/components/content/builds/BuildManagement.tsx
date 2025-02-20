
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const BuildManagement = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Build Management
        </CardTitle>
        <CardDescription>
          Manage and review community builds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-8">
          Build management features coming soon
        </div>
      </CardContent>
    </Card>
  );
};
