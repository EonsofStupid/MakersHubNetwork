import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const ActivitySettingsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Activity Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Activity settings implementation coming soon */}
          <div className="text-center text-gray-400 py-8">
            Activity and gamification settings coming soon
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};