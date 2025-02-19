
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ContentManagement = () => {
  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl font-heading">
              Content Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create and manage your platform's content
            </CardDescription>
          </div>
          <Button className="mad-scientist-hover">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-8">
          Content management features coming soon
        </div>
      </CardContent>
    </Card>
  );
};
