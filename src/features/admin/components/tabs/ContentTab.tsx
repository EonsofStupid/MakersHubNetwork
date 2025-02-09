
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ContentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage platform content and moderation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Content management features coming soon...</p>
      </CardContent>
    </Card>
  );
};

