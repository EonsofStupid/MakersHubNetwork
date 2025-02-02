import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Database, Box, Users, TrendingUp, BookOpen } from "lucide-react";
import { HeroSection } from "./components/HeroSection";
import { FeaturePanel } from "./components/FeaturePanel";
import { TableView } from "./components/DatabaseVisual/TableView";

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
  const textY = useTransform(scrollY, [0, 500], ["0%", "100%"]);
  const parallaxY = useTransform(scrollY, [0, 1000], ["0%", "25%"]);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#1a1a1a]">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-lime opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#41f0db]/10 via-[#ff0abe]/10 to-[#8000ff]/10" />
      </motion.div>

      <motion.div 
        style={{ y: parallaxY }}
        className="relative z-10"
      >
        <HeroSection />

        <div className="container mx-auto px-6 py-20">
          <TableView />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-20">
            <FeaturePanel
              icon={Database}
              title="Latest Builds"
              description="Explore our comprehensive database of 3D printer builds with detailed specifications and user reviews."
              gradient="bg-gradient-to-r from-[#41f0db]/20 to-[#8000ff]/20"
              link="/maker-space/builds"
            />
            <FeaturePanel
              icon={Box}
              title="Parts Catalog"
              description="Find compatible parts and upgrades for your 3D printer with our interactive catalog system."
              gradient="bg-gradient-to-r from-[#ff0abe]/20 to-[#41f0db]/20"
              link="/maker-space/parts"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            <FeaturePanel
              icon={BookOpen}
              title="Community Guides"
              description="Learn from expert makers with our comprehensive guide collection."
              gradient="bg-gradient-to-r from-[#41f0db]/20 to-[#ff0abe]/20"
              link="/maker-space/guides"
            />
            <FeaturePanel
              icon={Users}
              title="User Reviews"
              description="Real experiences from our community of makers."
              gradient="bg-gradient-to-r from-[#ff0abe]/20 to-[#8000ff]/20"
              link="/maker-space/reviews"
            />
            <FeaturePanel
              icon={TrendingUp}
              title="Trending Projects"
              description="Stay updated with the latest and most popular builds."
              gradient="bg-gradient-to-r from-[#8000ff]/20 to-[#41f0db]/20"
              link="/maker-space/builds/trending"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent z-20"
      />
    </div>
  );
};

export default LandingPage;