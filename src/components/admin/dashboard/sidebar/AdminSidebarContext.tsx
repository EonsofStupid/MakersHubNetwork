import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarContextType {
  isOpen: boolean;
  isExpanded: boolean;
  activeTab: string;
  shortcuts: string[];
  setIsOpen: (value: boolean) => void;
  setIsExpanded: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  addShortcut: (id: string) => void;
  removeShortcut: (id: string) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export const AdminSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shortcuts, setShortcuts] = useState<string[]>([]);

  // Load shortcuts from Supabase on mount
  useEffect(() => {
    const loadShortcuts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_toolbar_shortcuts')
        .select('item_id')
        .eq('user_id', user.id)
        .order('position');

      if (error) {
        console.error('Error loading shortcuts:', error);
        return;
      }

      setShortcuts(data.map(s => s.item_id));
    };

    loadShortcuts();
  }, []);

  const addShortcut = async (id: string) => {
    if (shortcuts.includes(id)) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('admin_toolbar_shortcuts')
      .insert({
        user_id: user.id,
        item_id: id,
        position: shortcuts.length
      });

    if (error) {
      console.error('Error saving shortcut:', error);
      toast.error('Failed to save shortcut');
      return;
    }

    setShortcuts([...shortcuts, id]);
  };

  const removeShortcut = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('admin_toolbar_shortcuts')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', id);

    if (error) {
      console.error('Error removing shortcut:', error);
      toast.error('Failed to remove shortcut');
      return;
    }

    setShortcuts(shortcuts.filter(s => s !== id));
  };

  return (
    <AdminSidebarContext.Provider value={{ 
      isOpen, 
      isExpanded,
      activeTab,
      setIsOpen, 
      setIsExpanded,
      setActiveTab,
      shortcuts, 
      addShortcut, 
      removeShortcut 
    }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
  }
  return context;
};