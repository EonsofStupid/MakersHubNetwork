
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useHomeStore } from '../store/home.store';
import { saveHomeLayout } from '../utils/homeLayoutLoader';
import { type SectionType } from '../schema/homeLayoutSchema';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { X, GripVertical, Settings, Save } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const sectionLabels: Record<SectionType, string> = {
  hero: 'Hero Banner',
  featured: 'Featured Content',
  categories: 'Category Browser',
  posts: 'Latest Posts',
  db: 'Database Items'
};

interface AdminOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  featuredPosts?: { id: string; title: string }[];
}

export function AdminOverlay({ isVisible, onClose, featuredPosts = [] }: AdminOverlayProps) {
  const { layout, updateSectionOrder, setFeaturedOverride } = useHomeStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(layout.section_order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    updateSectionOrder(items);
  }, [layout.section_order, updateSectionOrder]);

  const handleRemoveSection = useCallback((index: number) => {
    const newOrder = [...layout.section_order];
    newOrder.splice(index, 1);
    updateSectionOrder(newOrder);
  }, [layout.section_order, updateSectionOrder]);

  const handleAddSection = useCallback((section: SectionType) => {
    if (!layout.section_order.includes(section)) {
      updateSectionOrder([...layout.section_order, section]);
    }
  }, [layout.section_order, updateSectionOrder]);

  const handleFeaturedChange = useCallback((postId: string) => {
    setFeaturedOverride(postId === 'auto' ? null : postId);
  }, [setFeaturedOverride]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveHomeLayout(layout);
    setIsSaving(false);
  };

  // Available sections that can be added
  const availableSections = Object.keys(sectionLabels).filter(
    section => !layout.section_order.includes(section as SectionType)
  ) as SectionType[];

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Homepage Layout</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">Sections</h3>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 mb-4"
                >
                  {layout.section_order.map((section, index) => (
                    <Draggable key={section} draggableId={section} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between bg-muted/50 rounded-md p-2 border border-border"
                        >
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span>{sectionLabels[section]}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveSection(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {availableSections.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {availableSections.map(section => (
                <Button 
                  key={section} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddSection(section)}
                  className="text-xs"
                >
                  Add {sectionLabels[section]}
                </Button>
              ))}
            </div>
          )}
          
          {layout.section_order.includes('featured') && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Featured Content</h3>
              <Select
                value={layout.featured_override || 'auto'}
                onValueChange={handleFeaturedChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select featured content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automatic (Latest)</SelectItem>
                  {featuredPosts.map(post => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select "Automatic" to feature the most recent content
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <span className="animate-spin mr-2">⏳</span>}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Button to open the AdminOverlay
export function AdminOverlayButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "bg-background/80 backdrop-blur-sm",
        "border border-primary/30"
      )}
    >
      <Settings className="h-4 w-4 mr-2" />
      Edit Layout
    </Button>
  );
}
