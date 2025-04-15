
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-black/80 backdrop-blur-lg w-80 h-96 rounded-lg border border-primary/30 shadow-lg flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-primary/20">
            <h3 className="text-sm font-medium">Chat Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-3 overflow-auto">
            <div className="text-center text-sm text-muted-foreground p-4">
              Chat feature coming soon!
            </div>
          </div>
          <div className="p-3 border-t border-primary/20">
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-black/50 rounded px-3 py-2 text-sm border border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type your message"
                disabled
              />
              <Button size="sm" disabled>
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
}
