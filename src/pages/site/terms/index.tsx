import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6"
      >
        <h1 className="text-4xl font-bold text-[#41f0db] mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg">
            By using MakersImpulse, you agree to these terms of service. Our platform is designed
            to foster collaboration and innovation in the maker community while protecting intellectual
            property and ensuring a safe environment for all users.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;