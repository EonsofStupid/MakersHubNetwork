
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Database, 
  Loader2,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth/store";

// Type definitions
interface ShortcutItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  color?: string;
}

export const DashboardShortcuts: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useAuthStore();
  const userId = useAuthStore.getState().userId;

  // Default shortcuts
  const defaultShortcuts: ShortcutItem[] = [
    { id: "overview", label: "Overview", icon: "dashboard", path: "/admin?tab=overview" },
    { id: "users", label: "User Management", icon: "users", path: "/admin?tab=users" },
    { id: "content", label: "Content", icon: "content", path: "/admin?tab=content" },
    { id: "chats", label: "Chat", icon: "chat", path: "/admin?tab=chat" },
  ];

  // Load user shortcuts from Supabase
  useEffect(() => {
    const loadUserShortcuts = async () => {
      if (status !== "authenticated" || !userId) {
        setShortcuts(defaultShortcuts);
        setLoading(false);
        return;
      }

      try {
        // Check if admin_shortcuts table exists in database before querying
        const { data: tableExists } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_name', 'admin_shortcuts')
          .single();

        if (!tableExists) {
          // If table doesn't exist, use default shortcuts
          setShortcuts(defaultShortcuts);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('admin_shortcuts')
          .select('shortcuts')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error("Error loading shortcuts:", error);
          setShortcuts(defaultShortcuts);
        } else if (data) {
          setShortcuts(data.shortcuts || defaultShortcuts);
        } else {
          // No shortcuts found for this user, use defaults
          setShortcuts(defaultShortcuts);
          // Save defaults for future use
          saveShortcuts(defaultShortcuts);
        }
      } catch (error) {
        console.error("Error checking for admin_shortcuts table:", error);
        setShortcuts(defaultShortcuts);
      } finally {
        setLoading(false);
      }
    };

    loadUserShortcuts();
  }, [userId, status]);

  // Save shortcuts to Supabase
  const saveShortcuts = async (shortcutsToSave: ShortcutItem[]) => {
    if (status !== "authenticated" || !userId) return;
    
    setSaving(true);
    try {
      // Check if admin_shortcuts table exists
      const { data: tableExists } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'admin_shortcuts')
        .single();

      if (!tableExists) {
        // If table doesn't exist, we'll just use local state
        console.log("admin_shortcuts table doesn't exist, using local state only");
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('admin_shortcuts')
        .upsert(
          { user_id: userId, shortcuts: shortcutsToSave },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error("Error saving shortcuts:", error);
        toast({
          title: "Error saving shortcuts",
          description: "Your dashboard layout couldn't be saved.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking for admin_shortcuts table:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(shortcuts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setShortcuts(items);
    saveShortcuts(items);
  };

  // Navigate to shortcut destination
  const handleShortcutClick = (path: string) => {
    navigate(path);
  };

  // Render icon based on string identifier
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return <LayoutDashboard className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'content':
        return <FileText className="h-5 w-5" />;
      case 'chat':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  // Remove a shortcut
  const removeShortcut = (id: string) => {
    const updatedShortcuts = shortcuts.filter(shortcut => shortcut.id !== id);
    setShortcuts(updatedShortcuts);
    saveShortcuts(updatedShortcuts);
  };

  if (loading) {
    return (
      <Card className="cyber-card border-primary/20">
        <CardContent className="flex justify-center items-center p-6 min-h-[100px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyber-card border-primary/20">
      <CardContent className="p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="shortcuts" direction="horizontal">
            {(provided) => (
              <div
                className="flex flex-wrap gap-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {shortcuts.map((shortcut, index) => (
                  <Draggable key={shortcut.id} draggableId={shortcut.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "transition-all duration-150",
                          snapshot.isDragging ? "scale-105 shadow-lg" : ""
                        )}
                      >
                        <div className="relative group">
                          <Button
                            variant="outline"
                            className="h-auto py-3 px-4 bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30"
                            onClick={() => handleShortcutClick(shortcut.path)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {renderIcon(shortcut.icon)}
                              <span className="text-xs">{shortcut.label}</span>
                            </div>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeShortcut(shortcut.id)}
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {/* Add new shortcut button (placeholder for future functionality) */}
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 bg-primary/5 hover:bg-primary/10 border-dashed border-primary/20 hover:border-primary/30"
                  onClick={() => toast({
                    title: "Add Shortcut",
                    description: "This feature will be available soon!",
                  })}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Add</span>
                  </div>
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {saving && (
          <div className="absolute top-2 right-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
