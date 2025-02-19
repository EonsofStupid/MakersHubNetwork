
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ContentManagement = () => {
  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Content Management
            </CardTitle>
            <CardDescription>
              Create and manage your platform's content
            </CardDescription>
          </div>
          <Button className="relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
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
