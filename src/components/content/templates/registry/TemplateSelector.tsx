import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAvailableTemplates, TemplateType } from './TemplateRegistry';
import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  onSelect: (type: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const templates = getAvailableTemplates();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <motion.div
          key={template.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="p-6 bg-black/40 border border-white/10 hover:border-[#ff0abe]/50 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
            <p className="text-sm text-white/60 mb-4">{template.description}</p>
            <Button 
              onClick={() => onSelect(template.type)}
              className="w-full bg-[#ff0abe]/20 border border-[#ff0abe]/50 hover:bg-[#ff0abe]/30"
            >
              Use Template
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};