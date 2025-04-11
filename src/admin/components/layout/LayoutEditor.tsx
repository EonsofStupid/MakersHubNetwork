import React, { useState, useEffect } from 'react';
import { Layout, LayoutSkeleton } from '@/admin/types/layout.types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { Input } from '@/ui/core/input';
import { Label } from '@/ui/core/label';
import { Textarea } from '@/ui/core/textarea';
import { Switch } from '@/ui/core/switch';
import { LayoutRenderer } from './LayoutRenderer';
import { useLayoutSkeleton } from '@/admin/hooks/useLayoutSkeleton';
import { toast } from 'sonner';
import { Save, Eye, Code, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { Spinner } from '@/app/components/ui/spinner';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';

interface LayoutEditorProps {
  layout: Layout | null;
  onSave?: (layout: Layout) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

export function LayoutEditor({ layout, onSave, onCancel, readOnly = false }: LayoutEditorProps) {
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(layout);
  const [editMode, setEditMode] = useAtom(adminEditModeAtom);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editingJson, setEditingJson] = useState(JSON.stringify(layout?.components || [], null, 2));
  const [layoutMeta, setLayoutMeta] = useState({
    name: layout?.name || '',
    description: layout?.meta?.description || '',
    isActive: true,
    isLocked: false,
  });
  const [activeTab, setActiveTab] = useState('preview');
  
  const { useSaveLayout } = useLayoutSkeleton();
  const { mutate: saveLayout, isPending } = useSaveLayout();
  
  useEffect(() => {
    if (layout) {
      setCurrentLayout(layout);
      setEditingJson(JSON.stringify(layout.components || [], null, 2));
      setLayoutMeta({
        name: layout.name || '',
        description: layout.meta?.description || '',
        isActive: true,
        isLocked: false,
      });
    }
  }, [layout]);
  
  useEffect(() => {
    if (activeTab === 'json' && !editMode) {
      setEditMode(true);
    }
  }, [activeTab, editMode, setEditMode]);
  
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingJson(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setJsonError(null);
      
      if (currentLayout) {
        setCurrentLayout({
          ...currentLayout,
          components: parsed
        });
      }
    } catch (err) {
      setJsonError((err as Error).message || 'Invalid JSON');
    }
  };
  
  const handleSave = () => {
    if (!currentLayout) return;
    
    try {
      const components = JSON.parse(editingJson);
      
      const layoutToSave: Partial<LayoutSkeleton> = {
        id: currentLayout.id,
        name: layoutMeta.name,
        type: currentLayout.type,
        scope: currentLayout.scope,
        description: layoutMeta.description,
        is_active: layoutMeta.isActive,
        is_locked: layoutMeta.isLocked,
        layout_json: {
          components,
          version: currentLayout.version || 1,
        },
        version: currentLayout.version || 1,
      };
      
      saveLayout(layoutToSave, {
        onSuccess: (response) => {
          if (response.success && onSave && currentLayout) {
            onSave({
              ...currentLayout,
              components
            });
          }
        }
      });
    } catch (err) {
      toast.error('Invalid JSON', {
        description: (err as Error).message
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Layout Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Switch
                id="edit-mode"
                checked={editMode}
                onCheckedChange={setEditMode}
                disabled={readOnly}
              />
              <Label htmlFor="edit-mode" className="text-sm cursor-pointer">
                Edit Mode
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <Label htmlFor="layout-name">Layout Name</Label>
              <Input
                id="layout-name"
                value={layoutMeta.name}
                onChange={(e) => setLayoutMeta({ ...layoutMeta, name: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="layout-description">Description</Label>
              <Textarea
                id="layout-description"
                value={layoutMeta.description}
                onChange={(e) => setLayoutMeta({ ...layoutMeta, description: e.target.value })}
                disabled={readOnly}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={layoutMeta.isActive}
                  onCheckedChange={(checked) => setLayoutMeta({ ...layoutMeta, isActive: checked })}
                  disabled={readOnly}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-locked"
                  checked={layoutMeta.isLocked}
                  onCheckedChange={(checked) => setLayoutMeta({ ...layoutMeta, isLocked: checked })}
                  disabled={readOnly}
                />
                <Label htmlFor="is-locked">Locked</Label>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-1" disabled={readOnly}>
                <Code className="h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div className={cn(
                "border rounded-md p-4 min-h-[400px]",
                editMode && "border-dashed border-primary/50 bg-primary/5"
              )}>
                {currentLayout ? (
                  <LayoutRenderer layout={currentLayout} />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No layout available
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="json">
              <div className="space-y-2">
                <Textarea
                  className="font-mono text-sm min-h-[400px]"
                  value={editingJson}
                  onChange={handleJsonChange}
                  disabled={readOnly}
                />
                {jsonError && (
                  <div className="text-sm text-destructive">
                    Error: {jsonError}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={readOnly || isPending || !!jsonError}
          >
            {isPending ? <Spinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            Save Layout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
