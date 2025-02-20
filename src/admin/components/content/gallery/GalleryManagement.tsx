
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const GalleryManagement = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Gallery Management
        </CardTitle>
        <CardDescription>
          Manage media assets and galleries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-8">
          Gallery management features coming soon
        </div>
      </CardContent>
    </Card>
  );
};
