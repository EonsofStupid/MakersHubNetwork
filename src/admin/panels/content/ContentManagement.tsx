
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { 
  Tabs, 
  TabsList,
  TabsTrigger, 
  TabsContent 
} from '@/shared/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/shared/ui/card';

export default function ContentManagement() {
  const logger = useLogger('ContentManagement', LogCategory.ADMIN);
  
  React.useEffect(() => {
    logger.info('Content management component mounted');
  }, [logger]);
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>Manage website pages</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Page content management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Manage blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Post content management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Manage media files</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Media management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage content categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Category management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
