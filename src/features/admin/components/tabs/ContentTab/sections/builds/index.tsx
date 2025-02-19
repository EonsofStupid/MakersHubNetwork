
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const BuildManagement = () => {
  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-gradient text-2xl font-heading">
          3D Printer Builds
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Review and manage submitted printer builds
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
