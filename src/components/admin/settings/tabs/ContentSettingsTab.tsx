import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContentSettingsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Content Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content settings implementation coming soon */}
          <div className="text-center text-gray-400 py-8">
            Content management settings coming soon
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};