
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextWithPopupProps {
  text: string;
  label: string;
  maxLength?: number;
  className?: string;
}

export function TextWithPopup({ 
  text, 
  label, 
  maxLength = 20,
  className 
}: TextWithPopupProps) {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const displayText = text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={cn("relative", className)}>
      <div 
        className="flex items-center justify-between text-sm px-2 py-1 rounded-md bg-muted/50 hover:bg-muted cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        <div>
          <span className="text-xs font-medium text-muted-foreground mr-1">{label}:</span>
          <span className="font-mono">{displayText}</span>
        </div>
        <button 
          className="ml-2 text-muted-foreground hover:text-foreground p-1 rounded"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background p-4 rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{label}</h3>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? (
                  <span className="text-xs text-green-500 flex items-center">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Copied!
                  </span>
                ) : (
                  <span className="text-xs flex items-center">
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </span>
                )}
              </button>
            </div>
            <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre-wrap break-all">
              {text}
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                className="px-3 py-1 bg-primary/10 text-primary rounded text-sm hover:bg-primary/20"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
