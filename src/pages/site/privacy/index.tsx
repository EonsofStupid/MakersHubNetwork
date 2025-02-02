import React from "react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6"
      >
        <h1 className="text-4xl font-bold text-[#41f0db] mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg">
            At MakersImpulse, we take your privacy seriously. This policy outlines how we collect,
            use, and protect your personal information while providing you with the best possible
            maker community experience.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;