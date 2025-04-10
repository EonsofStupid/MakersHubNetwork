
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export interface ChatIndexProps {
  title?: string;
}

export const ChatIndex: React.FC<ChatIndexProps> = ({ 
  title = 'Chat Module'
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const logger = useLogger('ChatIndex', LogCategory.CHAT);
  
  const handleStartChat = () => {
    logger.info('User started chat session', {
      details: {
        userId: user?.id || 'anonymous'
      }
    });
    navigate('/chat/session');
  };
  
  const handleGoToAdmin = () => {
    // Use relative path instead of absolute path
    navigate('/admin');
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Start a new chat session or manage existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isAuthenticated 
              ? `Welcome back, ${user?.email}!` 
              : 'You are currently using chat as a guest'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleGoToAdmin}>
            Admin Panel
          </Button>
          <Button onClick={handleStartChat}>
            Start New Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatIndex;
