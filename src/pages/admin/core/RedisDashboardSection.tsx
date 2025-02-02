import React from 'react';
import { motion } from 'framer-motion';
import { RedisStatusCard } from '@/components/admin/redis/overview/RedisStatusCard';
import { RedisConnectionForm } from '@/components/admin/redis/config/RedisConnectionForm';
import { RedisFeatureToggles } from '@/components/admin/redis/config/RedisFeatureToggles';

export const RedisDashboardSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple">
        Redis Management
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RedisStatusCard />
        <div className="space-y-6">
          <RedisConnectionForm />
          <RedisFeatureToggles />
        </div>
      </div>
    </motion.div>
  );
};