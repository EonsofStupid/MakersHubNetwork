import React from 'react';
import { motion } from 'framer-motion';

interface TwoFactorHeaderProps {
  email: string;
}

export const TwoFactorHeader = ({ email }: TwoFactorHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-2"
    >
      <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
      <p className="text-white/80">
        Enter the verification code sent to
        <br />
        <span className="font-medium text-neon-cyan">{email}</span>
      </p>
    </motion.div>
  );
};