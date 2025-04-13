
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, Tabslist, TabsTrigger } from '@/shared/ui/tabs';
import { AuthPermissionValue } from '@/auth/permissions';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

// Mock content fetching function
const fetchContent = async (): Promise<any[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', title: 'Getting Started Guide', type: 'article', status: 'published' },
        { id: '2', title: 'Advanced Features', type: 'article', status: 'draft' },
        { id: '3', title: 'API Reference', type: 'documentation', status: 'published' },
        { id: '4', title: 'Video Tutorial', type: 'video', status: 'review' },
      ]);
    }, 500);
  });
};

/**
 * Content Management Panel for Administrators
 */
export const ContentManagement: React.FC = () => {
  const logger = useLogger('ContentManagement', LogCategory.ADMIN);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch content using React Query
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['admin', 'content'],
    queryFn: fetchContent,
  });
  
  // Check permissions
  const canCreate = RBACBridge.hasPermission('content:create');
  const canEdit = RBACBridge.hasPermission('content:edit');
  const canDelete = RBACBridge.hasPermission('content:delete');
  
  // Filter content based on active tab and search term
  const filteredContent = React.useMemo(() => {
    if (!content) return [];
    
    let filtered = content;
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [content, activeTab, searchTerm]);
  
  // Log content access
  React.useEffect(() => {
    logger.info('Content management panel accessed', {
      details: { contentCount: content?.length || 0 }
    });
  }, [content, logger]);
  
  // Handle create new content
  const handleCreateNew = () => {
    logger.info('Create new content button clicked');
    // Implementation here
  };
  
  // Handle edit content
  const handleEdit = (id: string) => {
    logger.info('Edit content', { details: { id } });
    // Implementation here
  };
  
  // Handle delete content
  const handleDelete = (id: string) => {
    logger.info('Delete content', { details: { id } });
    // Implementation here
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Content Management</CardTitle>
          {canCreate && (
            <Button onClick={handleCreateNew}>
              Create New
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <Tabslist>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </Tabslist>
            </div>
            
            <TabsContent value="all" className="mt-4">
              {renderContentTable()}
            </TabsContent>
            <TabsContent value="published" className="mt-4">
              {renderContentTable()}
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
              {renderContentTable()}
            </TabsContent>
            <TabsContent value="review" className="mt-4">
              {renderContentTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
  
  function renderContentTable() {
    if (isLoading) {
      return <div className="text-center py-4">Loading content...</div>;
    }
    
    if (error) {
      return <div className="text-center py-4 text-red-500">Error loading content</div>;
    }
    
    if (!filteredContent || filteredContent.length === 0) {
      return <div className="text-center py-4">No content found</div>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Title</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-right py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted transition-colors">
                <td className="py-2 px-4">{item.title}</td>
                <td className="py-2 px-4">{item.type}</td>
                <td className="py-2 px-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="space-x-2">
                    {canEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

// Status Badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default ContentManagement;
