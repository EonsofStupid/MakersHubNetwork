import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LayoutSkeleton } from '@/admin/types/layout.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { Input } from '@/ui/core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, FileText, Plus } from 'lucide-react';
import LayoutsPage from './LayoutsPage';
import { Skeleton } from '@/ui/core/skeleton';
import { LayoutEditor } from '@/admin/components/layout/LayoutEditor';
import { RequirePermission } from '@/admin/components/auth/RequirePermission';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export function LayoutManager() {
  const [selectedType, setSelectedType] = useState<string>('dashboard');
  const [scope, setScope] = useState<string>('admin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: layouts, isLoading } = useQuery({
    queryKey: ['layouts', selectedType, scope, sortDirection, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('layout_skeletons')
        .select('*');
      
      if (selectedType) {
        query = query.eq('type', selectedType);
      }
      
      if (scope) {
        query = query.eq('scope', scope);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query
        .order('updated_at', { ascending: sortDirection === 'asc' });
        
      if (error) {
        console.error('Error fetching layouts:', error);
        return [];
      }
      
      return data as LayoutSkeleton[];
    },
  });
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <RequirePermission permission={ADMIN_PERMISSIONS.ADMIN_EDIT}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Layout Management</CardTitle>
              <Button variant="outline" size="sm" onClick={toggleSortDirection}>
                <ArrowDownUp className="h-4 w-4 mr-2" />
                {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input 
                  placeholder="Search layouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Layout Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="widget">Widget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : layouts && layouts.length > 0 ? (
              <div className="space-y-2">
                {layouts.map((layout) => (
                  <div 
                    key={layout.id} 
                    className="p-3 border rounded-md flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{layout.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(layout.updated_at).toLocaleDateString()}
                          {layout.is_active && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-[10px]">Active</span>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p>No layouts found matching your criteria</p>
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Layout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div>
          <Tabs defaultValue="manage">
            <TabsList>
              <TabsTrigger value="manage">Layout List</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>
            <TabsContent value="manage">
              <LayoutsPage />
            </TabsContent>
            <TabsContent value="editor">
              <Card>
                <CardContent className="pt-6">
                  <LayoutEditor layout={null} readOnly={false} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequirePermission>
  );
}
