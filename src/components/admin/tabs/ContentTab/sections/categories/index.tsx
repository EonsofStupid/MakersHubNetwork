
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CategoryManagement = () => {
  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl font-heading">
              Categories
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage content categories and organization
            </CardDescription>
          </div>
          <Button className="mad-scientist-hover">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-8">
          Category management features coming soon
        </div>
      </CardContent>
    </Card>
  );
};
