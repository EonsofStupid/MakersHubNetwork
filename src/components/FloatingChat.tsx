
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/auth/store/auth.store';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: 'system', content: 'Welcome to the chat assistant! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { isAuthenticated } = useAuthStore();
  
  // Default to enabled chat
  const isChatEnabled = true;
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, { role: 'user', content: inputValue }]);
      
      // Simulate response after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: `This is a demo response to "${inputValue}". The real chat functionality will be implemented later.` 
        }]);
      }, 1000);
      
      // Clear input
      setInputValue('');
    }
  };
  
  // If chat is not enabled, don't render anything
  if (!isChatEnabled) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button 
          onClick={toggleChat}
          className="h-12 w-12 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-[#00F0FF] text-black hover:bg-[#FF2D6E] hover:shadow-[0_0_15px_rgba(255,45,110,0.4)] transition-all duration-300"
          size="icon"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </Button>
      ) : (
        <div className="bg-black/90 border border-[#00F0FF]/40 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.25)] w-80 sm:w-96 h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-[#00F0FF]/30 bg-[#00F0FF]/10">
            <h3 className="text-[#00F0FF] font-medium flex items-center gap-2">
              <MessageCircle size={16} className="text-[#00F0FF]" />
              Chat Assistant
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleChat}
              className="h-8 w-8 p-0 text-[#00F0FF] hover:text-[#FF2D6E] hover:bg-transparent"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${
                  msg.role === 'user' 
                    ? 'ml-auto bg-[#00F0FF]/20 text-white' 
                    : 'mr-auto bg-[#1A1F2C] text-[#00F0FF]'
                } p-3 rounded-lg max-w-[80%] shadow-sm`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-[#00F0FF]/30 p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[#1A1F2C] border border-[#00F0FF]/30 rounded p-2 text-white focus:outline-none focus:border-[#00F0FF]"
            />
            <Button 
              type="submit" 
              className="bg-[#00F0FF] text-black hover:bg-[#FF2D6E]"
            >
              <ChevronUp size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
