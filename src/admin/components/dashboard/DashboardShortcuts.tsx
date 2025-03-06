
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronRightCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth/store";
import { useAdminStore } from "@/admin/store/admin.store";
import { AdminShortcut } from "@/admin/types/admin.types";
import { toast } from "sonner";

export const DashboardShortcuts: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<AdminShortcut[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newShortcut, setNewShortcut] = useState({
    id: "",
    label: "",
    path: "",
    icon: "ChevronRightCircle",
    color: "#3b82f6"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { hasPermission } = useAdminStore();
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (userId) {
      loadShortcuts();
    }
  }, [userId]);

  const loadShortcuts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_shortcuts')
        .select('shortcuts')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.shortcuts) {
        setShortcuts(data.shortcuts as AdminShortcut[]);
      } else {
        // Set default shortcuts if none exist
        const defaultShortcuts: AdminShortcut[] = [
          {
            id: "dashboard",
            label: "Dashboard",
            path: "/admin",
            icon: "Home",
            color: "#3b82f6"
          },
          {
            id: "users",
            label: "Users",
            path: "/admin?tab=users",
            icon: "Users",
            color: "#10b981"
          }
        ];
        setShortcuts(defaultShortcuts);
        saveShortcuts(defaultShortcuts);
      }
    } catch (error) {
      console.error("Error loading shortcuts:", error);
      toast.error("Failed to load shortcuts");
    } finally {
      setIsLoading(false);
    }
  };

  const saveShortcuts = async (shortcutsToSave: AdminShortcut[]) => {
    try {
      const { error } = await supabase
        .from('admin_shortcuts')
        .upsert({ 
          user_id: userId, 
          shortcuts: shortcutsToSave 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;
      toast.success("Shortcuts saved successfully");
    } catch (error) {
      console.error("Error saving shortcuts:", error);
      toast.error("Failed to save shortcuts");
    }
  };

  const addShortcut = () => {
    if (!newShortcut.label || !newShortcut.path) {
      toast.error("Label and path are required");
      return;
    }

    const updatedShortcuts = [
      ...shortcuts,
      {
        ...newShortcut,
        id: Date.now().toString()
      }
    ];

    setShortcuts(updatedShortcuts);
    saveShortcuts(updatedShortcuts);
    setNewShortcut({
      id: "",
      label: "",
      path: "",
      icon: "ChevronRightCircle",
      color: "#3b82f6"
    });
    setIsEditing(false);
  };

  const removeShortcut = (id: string) => {
    const updatedShortcuts = shortcuts.filter(shortcut => shortcut.id !== id);
    setShortcuts(updatedShortcuts);
    saveShortcuts(updatedShortcuts);
  };

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used admin shortcuts
          </CardDescription>
        </div>
        {hasPermission('admin:settings:write') && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Shortcut</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="shortcut-label">Label</Label>
                  <Input 
                    id="shortcut-label" 
                    value={newShortcut.label} 
                    onChange={(e) => setNewShortcut({...newShortcut, label: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortcut-path">Path</Label>
                  <Input 
                    id="shortcut-path" 
                    value={newShortcut.path} 
                    onChange={(e) => setNewShortcut({...newShortcut, path: e.target.value})}
                  />
                </div>
                <Button onClick={addShortcut} className="w-full">
                  Add Shortcut
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div 
              key={shortcut.id}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md group"
            >
              <Button
                variant="ghost"
                className="justify-start px-2 gap-2 flex-1 text-left"
                onClick={() => {
                  /* Navigation logic here */
                }}
              >
                <ChevronRightCircle className="h-4 w-4" style={{ color: shortcut.color }} />
                <span>{shortcut.label}</span>
              </Button>
              {hasPermission('admin:settings:write') && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => removeShortcut(shortcut.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {shortcuts.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              No shortcuts available
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              Loading shortcuts...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
