
import React from 'react';
import { useParams } from 'react-router-dom';
import { SendHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { Button } from '@/ui/core/button';
import { motion } from 'framer-motion';
import { Textarea } from '@/ui/core/textarea';

export function ChatSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [message, setMessage] = React.useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {/* AI Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">AI</span>
            </div>
            <Card className="max-w-[80%]">
              <CardContent className="p-3">
                <p className="text-sm">Hello! How can I assist you today?</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 justify-end"
          >
            <Card className="max-w-[80%] bg-primary/10">
              <CardContent className="p-3">
                <p className="text-sm">I'd like to discuss a new project idea.</p>
              </CardContent>
            </Card>
            <div className="h-8 w-8 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold">ME</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            className="h-[60px] w-[60px]"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
