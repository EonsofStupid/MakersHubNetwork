
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/core/button';

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleChat} 
        variant="default" 
        className="rounded-full h-12 w-12 flex items-center justify-center hover:bg-primary/90"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle className="h-5 w-5" />
        </motion.div>
      </Button>
    </div>
  );
}
