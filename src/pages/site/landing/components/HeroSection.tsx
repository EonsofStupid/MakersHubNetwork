import { motion } from "framer-motion";
import { Search } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lovable-uploads/4edf410a-5bd3-426b-8efe-fb8acb60e39c.png')",
          backgroundPosition: "center 40%"
        }}
      />
      
      <div className="container mx-auto px-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <h1 className="landing-title text-[#41f0db] text-4xl md:text-6xl font-bold mb-6">
            Build your 3D Printer Dream
          </h1>
          
          <p className="landing-text text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Your hub for 3D printing innovation. Discover builds, parts, and join our community of makers.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search builds, parts, or guides..."
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-[#8000ff] rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#8000ff] transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};