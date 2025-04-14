
import React, { useState } from 'react';
import { useThemeStore } from '@/shared/stores/theme/store';
import { Send } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface ChatWidgetProps {
  title?: string;
  onSend?: (message: string) => void;
  loading?: boolean;
  messages?: any[];
  className?: string;
  height?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  title = 'Chat',
  onSend,
  loading = false,
  messages = [],
  className = '',
  height = '500px',
}) => {
  const [input, setInput] = useState('');
  const theme = useThemeStore(state => state);

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`flex flex-col w-full overflow-hidden ${className}`} style={{ height }}>
      <CardHeader className="py-3 px-4 border-b">
        <h3 className="text-lg font-medium">{title}</h3>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-10 flex-1"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWidget;
