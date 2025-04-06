
import React from 'react';
import { Link } from '@tanstack/react-router';
import { DockableChat } from '../chat-client/components/DockableChat';
import { Button } from '@/components/ui/button';

export default function ChatIndexPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat System</h1>
        <p className="text-gray-600">
          This is the main entry point for the chat functionality.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            You can use the chat component in docked or floating mode.
            Integration options are available for various parts of the application.
          </p>
          
          <div className="flex flex-col space-y-4 mt-6">
            <Button asChild variant="outline">
              <Link to="/chat/dev">Open Developer Chat</Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/admin/settings">Chat Settings</Link>
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium mb-3">Chat Preview</h3>
          <DockableChat />
        </div>
      </div>
    </div>
  );
}
