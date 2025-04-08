
import React from 'react';
import { useChatSession } from '../hooks/useChatSession';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus } from 'lucide-react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { v4 as uuidv4 } from 'uuid';

export default function ChatHome() {
  const { user, isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = React.useState('');
  const { messages, sendMessage, isLoading } = useChatSession();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Create new chat session
  const createNewSession = () => {
    const sessionId = uuidv4();
    navigate({ to: `/chat/session/${sessionId}` });
  };
  
  // Handle message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Chat Access</CardTitle>
            <CardDescription>
              You need to be logged in to use the chat feature.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate({ to: '/login' })}>Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Button 
              onClick={createNewSession} 
              className="w-full flex items-center gap-2"
              variant="secondary"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </Button>
            
            <div className="border rounded-md p-4 bg-card">
              <h3 className="font-medium mb-2">Recent Chats</h3>
              <div className="text-sm text-muted-foreground">
                No recent chats
              </div>
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="md:col-span-3">
            <Card className="min-h-[80vh] flex flex-col">
              <CardHeader>
                <CardTitle>New Conversation</CardTitle>
                <CardDescription>
                  Start chatting with the assistant
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
                <form onSubmit={handleSendMessage} className="w-full">
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
        </div>
      </div>
    </div>
  );
}
