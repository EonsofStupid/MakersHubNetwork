import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAvailableTemplates } from '../registry/TemplateRegistry';
import { TemplateType } from '../types/template';
import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  onSelect: (type: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const templates = getAvailableTemplates();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => {
        const Icon = template.icon;
        
        return (
          <motion.div
            key={template.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className="p-6 bg-black/40 border border-white/10 hover:border-[#ff0abe]/50 transition-all duration-300 cursor-pointer"
              onClick={() => onSelect(template.type)}
            >
              <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon className="h-5 w-5 text-[#ff0abe]" />}
                <h3 className="font-medium text-white">{template.name}</h3>
              </div>
              <p className="text-sm text-white/60">{template.description}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};