
import React from 'react';
import { useChat } from '../context/ChatProvider';
import { MessageCircle, X, Send } from 'lucide-react';
import { useThemeStore } from '@/stores/theme/store';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useMobile } from '@/hooks/use-mobile';

export function ChatWidget() {
  const { isOpen, toggleChat, messages, sendMessage, isLoading: chatIsLoading } = useChat();
  const { user } = useAuthState();
  const { hasAdminAccess, isAdmin } = useAdminAccess();
  const [input, setInput] = React.useState('');
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !chatIsLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  
  // If not open, show the floating button
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-50 bg-primary hover:bg-primary/90"
      >
        <MessageCircle size={24} />
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-xl z-50 flex flex-col overflow-hidden max-h-[70vh] rounded-lg border border-border bg-card text-card-foreground">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <h3 className="font-medium">Chat Assistant</h3>
        <Button variant="ghost" size="icon" onClick={toggleChat}>
          <X size={18} />
        </Button>
      </div>
      
      {/* Messages area */}
      <div 
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[50vh]"
      >
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted text-muted-foreground rounded-tl-none'
                }`}
              >
                <p>{msg.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {chatIsLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t p-3 bg-background">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] max-h-[120px]"
            disabled={chatIsLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || chatIsLoading}
            className="h-10 w-10"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
