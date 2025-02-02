import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { BaseContent } from '@/components/content/types/cms';

interface PreviewDialogProps {
  content: BaseContent;
  trigger?: React.ReactNode;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({ content, trigger }) => {
  const [activeView, setActiveView] = React.useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [content]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#41f0db]" />
        </div>
      );
    }

    switch (content.type) {
      case 'page':
        return (
          <div className="prose prose-invert max-w-none">
            <h1>{content.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content.content as string }} />
          </div>
        );
      case 'component':
        return (
          <div className="p-4 border border-white/10 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>
            <pre className="bg-black/50 p-4 rounded overflow-auto">
              {JSON.stringify(content.content, null, 2)}
            </pre>
          </div>
        );
      default:
        return (
          <div className="text-center text-gray-400">
            Preview not available for this content type
          </div>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="bg-[#41f0db]/20 backdrop-blur-sm text-white border border-[#41f0db]/50 hover:bg-[#41f0db]/30 hover:border-[#41f0db] transition-all duration-300 shadow-[0_0_10px_rgba(65,240,219,0.3)] animate-fade-in"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black/90 border border-[#41f0db]/30 backdrop-blur-xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{content.title || 'Content Preview'}</span>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'desktop' | 'mobile')}>
              <TabsList className="bg-white/5">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-y-auto"
        >
          <div 
            className={`
              transition-all duration-300 mx-auto
              ${activeView === 'mobile' ? 'max-w-[375px]' : 'max-w-none'}
            `}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 min-h-[200px]">
              {renderContent()}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;