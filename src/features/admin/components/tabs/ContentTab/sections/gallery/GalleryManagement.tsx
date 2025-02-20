
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid, Plus, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

type GalleryItem = {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  uploadedBy: string;
  uploadedAt: string;
};

const mockData: GalleryItem[] = [
  {
    id: '1',
    title: 'Ender 3 Setup',
    url: '/images/ender3-setup.jpg',
    type: 'image',
    uploadedBy: 'maker123',
    uploadedAt: '2024-02-19T12:00:00Z',
  },
  {
    id: '2',
    title: 'Voron Build Process',
    url: '/images/voron-build.jpg',
    type: 'image',
    uploadedBy: 'voronUser',
    uploadedAt: '2024-02-18T15:30:00Z',
  },
];

export const GalleryManagement = () => {
  const [items] = useState<GalleryItem[]>(mockData);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <Card className="cyber-card backdrop-blur-sm bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gallery Management
            </CardTitle>
            <CardDescription>
              Manage media assets and uploads
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary/20' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              className="relative group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
              <Plus className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden border border-primary/20 aspect-square"
            >
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              {item.type === 'image' ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
