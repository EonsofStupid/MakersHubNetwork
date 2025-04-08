
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AuthGuard } from '@/components/AuthGuard';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';

export default function ChatLayout() {
  const navigate = useNavigate();
  
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <header className="bg-card border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">Chat Module</h1>
              
              <nav className="hidden md:flex gap-4">
                <Button variant="ghost" onClick={() => navigate({ to: '/chat' })}>Home</Button>
                <Button variant="ghost" onClick={() => navigate({ to: '/chat/dev' })}>Dev Mode</Button>
              </nav>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
                <Home size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
        
        <footer className="bg-card border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            Chat Module &copy; {new Date().getFullYear()} - Powered by ChatBridge
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
