
import React from 'react';
import { useChatSession } from '../hooks/useChatSession';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft } from 'lucide-react';

export interface ChatSessionProps {
  sessionId: string;
}

export default function ChatSession({ sessionId }: ChatSessionProps) {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = React.useState('');
  const { messages, sendMessage, isLoading } = useChatSession({ sessionId });
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-[90vh]">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate({ to: '/chat' })}
      >
        <ArrowLeft size={16} /> Back to Chat Home
      </Button>
      
      <Card className="min-h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle>Chat Session</CardTitle>
          <CardDescription>
            Session ID: {sessionId}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Send a message to start the conversation
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div>{message.content}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!inputMessage.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
