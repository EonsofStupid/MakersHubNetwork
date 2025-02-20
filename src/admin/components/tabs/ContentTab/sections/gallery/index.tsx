
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GalleryManagement = () => {
  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl font-heading">
              Media Gallery
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your media assets and uploads
            </CardDescription>
          </div>
          <Button className="mad-scientist-hover">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-8">
          Media gallery features coming soon
        </div>
      </CardContent>
    </Card>
  );
};
