
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImpulseAdminLayout } from '@/admin/components/layout/ImpulseAdminLayout';
import { Button } from '@/components/ui/button';
import { Layout, LayoutSkeleton, LayoutSchema } from '@/admin/types/layout.types';
import { LayoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { LayoutEditor } from '@/admin/components/layout/LayoutEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RequirePermission } from '@/admin/components/auth/RequirePermission';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { Spinner } from '@/components/ui/spinner';

function LayoutsPage() {
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [showNewLayoutForm, setShowNewLayoutForm] = useState(false);
  const [newLayout, setNewLayout] = useState({
    name: '',
    type: 'dashboard',
    scope: 'admin',
    description: '',
  });
  
  // Fetch all layouts
  const { data: layouts, isLoading, refetch } = useQuery({
    queryKey: ['layouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching layouts:', error);
        return [];
      }
      
      return data as LayoutSkeleton[];
    },
  });
  
  // Fetch selected layout
  const { data: selectedLayout, isLoading: isLoadingSelected } = useQuery({
    queryKey: ['layout', selectedLayoutId],
    queryFn: async () => {
      if (!selectedLayoutId) return null;
      
      const skeleton = await LayoutSkeletonService.getById(selectedLayoutId);
      if (!skeleton) return null;
      
      return LayoutSkeletonService.convertToLayout(skeleton);
    },
    enabled: !!selectedLayoutId,
  });
  
  // Handle create new layout
  const handleCreateLayout = async () => {
    if (!newLayout.name || !newLayout.type || !newLayout.scope) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create a default empty layout
    const defaultLayout: Partial<LayoutSkeleton> = {
      name: newLayout.name,
      type: newLayout.type,
      scope: newLayout.scope,
      description: newLayout.description,
      is_active: true,
      is_locked: false,
      layout_json: {
        components: [],
        version: 1,
      },
      version: 1,
    };
    
    try {
      const result = await LayoutSkeletonService.saveLayout(defaultLayout);
      
      if (result.success) {
        toast.success('Layout created successfully');
        setShowNewLayoutForm(false);
        setNewLayout({
          name: '',
          type: 'dashboard',
          scope: 'admin',
          description: '',
        });
        refetch();
        
        // Select the new layout
        if (result.id) {
          setSelectedLayoutId(result.id);
        }
      } else {
        toast.error('Failed to create layout', {
          description: result.error
        });
      }
    } catch (error: any) {
      toast.error('Error creating layout', {
        description: error.message
      });
    }
  };
  
  // Handle delete layout
  const handleDeleteLayout = async (id: string) => {
    try {
      const result = await LayoutSkeletonService.deleteLayout(id);
      
      if (result.success) {
        toast.success('Layout deleted successfully');
        refetch();
        
        // Clear selection if the deleted layout was selected
        if (selectedLayoutId === id) {
          setSelectedLayoutId(null);
        }
      } else {
        toast.error('Failed to delete layout', {
          description: result.error
        });
      }
    } catch (error: any) {
      toast.error('Error deleting layout', {
        description: error.message
      });
    }
  };
  
  return (
    <RequirePermission permission={ADMIN_PERMISSIONS.ADMIN_EDIT}>
      <ImpulseAdminLayout title="Layout Management">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Layout Management</h1>
            <Button onClick={() => setShowNewLayoutForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Layout
            </Button>
          </div>
          
          {showNewLayoutForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Layout</CardTitle>
                <CardDescription>Define the basic properties for your new layout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Layout Name</Label>
                    <Input
                      id="name"
                      placeholder="My Dashboard Layout"
                      value={newLayout.name}
                      onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Layout Type</Label>
                      <Select
                        value={newLayout.type}
                        onValueChange={(value) => setNewLayout({ ...newLayout, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="section">Section</SelectItem>
                          <SelectItem value="modal">Modal</SelectItem>
                          <SelectItem value="widget">Widget</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scope">Scope</Label>
                      <Select
                        value={newLayout.scope}
                        onValueChange={(value) => setNewLayout({ ...newLayout, scope: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Describe this layout's purpose"
                      value={newLayout.description}
                      onChange={(e) => setNewLayout({ ...newLayout, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowNewLayoutForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateLayout}>
                      Create Layout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Available Layouts</CardTitle>
                  <CardDescription>
                    Select a layout to preview or edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <Spinner />
                    </div>
                  ) : layouts && layouts.length > 0 ? (
                    <div className="space-y-2">
                      {layouts.map((layout) => (
                        <div
                          key={layout.id}
                          className={`p-3 rounded-md flex items-center justify-between cursor-pointer ${
                            selectedLayoutId === layout.id
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedLayoutId(layout.id)}
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{layout.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {layout.type} / {layout.scope}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Layout</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the "{layout.name}" layout? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteLayout(layout.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      No layouts found. Create one to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {isLoadingSelected ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner />
                </div>
              ) : selectedLayout ? (
                <LayoutEditor 
                  layout={selectedLayout}
                  onSave={() => refetch()}
                  onCancel={() => setSelectedLayoutId(null)}
                />
              ) : (
                <Card className="h-64">
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select a layout from the list or create a new one</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </ImpulseAdminLayout>
    </RequirePermission>
  );
}

export default LayoutsPage;
