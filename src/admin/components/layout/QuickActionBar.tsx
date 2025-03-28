
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Eye, EyeOff, Settings, Monitor, FileText, Save } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';

export function QuickActionBar() {
  const { isDarkMode, toggleDarkMode } = useAdminStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-1 rounded-lg bg-background/80 p-1 backdrop-blur shadow-lg border border-primary/20 animate-in fade-in slide-in-from-bottom-5">
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Redo">
        <Redo className="h-4 w-4" />
      </Button>
      <div className="h-8 w-[1px] bg-border mx-1" />
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        onClick={toggleDarkMode}
      >
        {isDarkMode ? <Monitor className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Settings">
        <Settings className="h-4 w-4" />
      </Button>
      <div className="h-8 w-[1px] bg-border mx-1" />
      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" title="Save Changes">
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );
}
