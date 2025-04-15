
import React from 'react';
import { FeaturesSection } from '@/app/components/landing/FeaturesSection';
import { Button } from '@/shared/ui/button';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section with cyberpunk styling */}
      <section className="relative h-[90vh] overflow-hidden flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00F0FF]/10 to-transparent opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-30"></div>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 cyber-text">
              <span className="block">MAKERS</span>
              <span className="text-[#FF2D6E]">IMPULSE</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-[#00F0FF]/80">
              The ultimate community for 3D printing enthusiasts, makers, and builders.
              Share your projects, learn from others, and push the boundaries of what's possible.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black text-lg px-8 py-6 h-auto cyber-glow"
                size="lg"
              >
                Join the Community
              </Button>
              <Button 
                variant="outline" 
                className="border-[#FF2D6E] text-[#FF2D6E] hover:bg-[#FF2D6E]/10 text-lg px-8 py-6 h-auto"
                size="lg"
              >
                Explore Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features section */}
      <FeaturesSection />
      
      {/* Community stats section */}
      <section className="py-16 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 cyber-text">Join Our Growing Community</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '10,000+', label: 'Makers' },
              { value: '25,000+', label: 'Projects' },
              { value: '5,000+', label: 'Printer Mods' },
              { value: '50,000+', label: 'Downloads' }
            ].map((stat, index) => (
              <div key={index} className="text-center cyber-border p-4">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#00F0FF]">{stat.value}</div>
                <div className="text-[#FF2D6E]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
