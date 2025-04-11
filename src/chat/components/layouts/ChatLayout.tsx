
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Settings, MessageSquare } from 'lucide-react';
import { AuthGuard } from '@/ui/auth/guard/AuthGuard';
import { Button } from '@/ui/core/button';

export function ChatLayout() {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-background border-r border-border flex flex-col items-center py-4">
          <Button variant="ghost" size="icon" className="mb-6">
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <div className="mt-auto">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </AuthGuard>
  );
}
