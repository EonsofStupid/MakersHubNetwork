import { HeroSection } from "@/pages/site/landing/components/HeroSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const MakerSpace = () => {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
  const textY = useTransform(scrollY, [0, 500], ["0%", "100%"]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-[#1a1a1a]"
    >
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/20 to-neon-pink/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <HeroSection />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent z-20"
      />
    </div>
  );
};

export default MakerSpace;