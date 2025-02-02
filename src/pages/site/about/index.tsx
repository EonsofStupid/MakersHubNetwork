import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6"
      >
        <h1 className="text-4xl font-bold text-[#41f0db] mb-8">About MakersImpulse</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg">
            MakersImpulse is a community-driven platform dedicated to advancing the world of 3D printing
            and maker culture. We bring together enthusiasts, professionals, and newcomers to share knowledge,
            showcase creations, and push the boundaries of what's possible in the maker space.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;