
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutSkeleton, parseLayoutJson } from '@/admin/types/layout.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function parseLayoutData(data: any): LayoutSkeleton {
  return {
    ...data,
    layout_json: {
      components: data.layout_json?.components || [],
      version: data.layout_json?.version || 1,
      meta: data.layout_json?.meta || {}
    }
  };
}

function LayoutsPage() {
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [showNewLayoutForm, setShowNewLayoutForm] = useState(false);
  const [newLayout, setNewLayout] = useState({
    name: '',
    type: 'dashboard',
    scope: 'admin',
    description: '',
  });
  
  const logger = useLogger('LayoutsPage', { category: LogCategory.ADMIN });
  
  // Fetch all layouts
  const { data: layouts, isLoading, refetch } = useQuery({
    queryKey: ['layouts'],
    queryFn: async () => {
      const result = await layoutSkeletonService.getAll();
      if (!result.data) {
        throw new Error(result.error || 'Failed to fetch layouts');
      }
      return result.data;
    }
  });
  
  // Fetch selected layout details
  const { data: selectedLayout, isLoading: isLoadingSelected } = useQuery({
    queryKey: ['layout', selectedLayoutId],
    queryFn: async () => {
      if (!selectedLayoutId) return null;
      
      const response = await layoutSkeletonService.getById(selectedLayoutId);
      if (!response.data) {
        logger.error('Failed to get layout by ID', { 
          details: { id: selectedLayoutId, error: response.error }
        });
        return null;
      }
      
      return layoutSkeletonService.convertToLayout(response.data);
    },
    enabled: !!selectedLayoutId,
  });
  
  // Create a new layout
  const handleCreateLayout = async () => {
    if (!newLayout.name || !newLayout.type || !newLayout.scope) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const defaultLayout: Partial<LayoutSkeleton> = {
      name: newLayout.name,
      type: newLayout.type,
      scope: newLayout.scope,
      description: newLayout.description || null,
      is_active: true,
      is_locked: false,
      layout_json: {
        components: [],
        version: 1,
      },
      version: 1,
    };
    
    try {
      const result = await layoutSkeletonService.saveLayout(defaultLayout);
      
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
  
  // Delete a layout
  const handleDeleteLayout = async (id: string) => {
    try {
      const result = await layoutSkeletonService.delete(id);
      
      if (result.success) {
        toast.success('Layout deleted successfully');
        
        if (selectedLayoutId === id) {
          setSelectedLayoutId(null);
        }
        
        refetch();
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

  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLayout(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewLayout(prev => ({ ...prev, [name]: value }));
  };
  
  // Layout selection handler
  const handleSelectLayout = (id: string) => {
    setSelectedLayoutId(id);
    setShowNewLayoutForm(false);
  };

  // Create new layout form handler  
  const handleNewLayoutClick = () => {
    setSelectedLayoutId(null);
    setShowNewLayoutForm(true);
  };

  // Layout list rendering
  const renderLayoutsList = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-6">Loading layouts...</div>;
    }
    
    if (!layouts || layouts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <p className="mb-4 text-muted-foreground">No layouts found</p>
          <Button onClick={handleNewLayoutClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Layout
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {layouts.map(layout => (
          <div
            key={layout.id}
            className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:bg-muted transition-colors
              ${selectedLayoutId === layout.id ? 'border-primary bg-primary/5' : 'border-border'}`}
            onClick={() => handleSelectLayout(layout.id)}
          >
            <div>
              <h3 className="font-medium">{layout.name}</h3>
              <p className="text-sm text-muted-foreground">
                {layout.type} / {layout.scope}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this layout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    layout and any associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayout(layout.id);
                    }}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    );
  };

  // New layout form
  const renderNewLayoutForm = () => {
    return (
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Create New Layout</CardTitle>
          <CardDescription>Define the basic properties for your new layout</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Layout Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Dashboard Layout"
                value={newLayout.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Layout Type</Label>
              <Select
                value={newLayout.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Layout Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="section">Section</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scope">Layout Scope</Label>
              <Select
                value={newLayout.scope}
                onValueChange={(value) => handleSelectChange('scope', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Layout Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Optional description"
                value={newLayout.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNewLayoutForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateLayout}
              >
                Create Layout
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  // Layout detail view
  const renderLayoutDetail = () => {
    if (isLoadingSelected) {
      return <div className="flex items-center justify-center p-6">Loading layout details...</div>;
    }
    
    if (!selectedLayout) {
      return null;
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>{selectedLayout.name}</CardTitle>
          <CardDescription>
            {selectedLayout.type} / {selectedLayout.scope}
            {selectedLayout.description && <p className="mt-1">{selectedLayout.description}</p>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Layout preview not available</p>
              </div>
            </TabsContent>
            
            <TabsContent value="json">
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px] text-xs">
                {JSON.stringify(selectedLayout.components, null, 2)}
              </pre>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Active</h4>
                    <p className="text-sm text-muted-foreground">Layout is active and can be used in the application</p>
                  </div>
                  <div>{selectedLayout.is_active ? 'Yes' : 'No'}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Locked</h4>
                    <p className="text-sm text-muted-foreground">Layout is locked and cannot be modified</p>
                  </div>
                  <div>{selectedLayout.is_locked ? 'Yes' : 'No'}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Created</h4>
                  </div>
                  <div>{new Date(selectedLayout.created_at).toLocaleString()}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Updated</h4>
                  </div>
                  <div>{new Date(selectedLayout.updated_at).toLocaleString()}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Layout Manager</h1>
        <Button onClick={handleNewLayoutClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Layout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Layouts
            </h2>
            {renderLayoutsList()}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {showNewLayoutForm ? renderNewLayoutForm() : renderLayoutDetail()}
        </div>
      </div>
    </div>
  );
}

export default LayoutsPage;
