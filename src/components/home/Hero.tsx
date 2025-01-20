import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsFlipped(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center animate-fade-up">
      <h1 
        className={`
          text-6xl font-bold mb-6 
          perspective-[1000px] inline-block
          transition-all duration-700
          cursor-pointer
          relative
          ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}
          before:content-[''] before:absolute before:inset-0
          before:bg-[rgba(0,240,255,0.1)] before:backdrop-blur-sm
          before:rounded-xl before:border before:border-[rgba(255,255,255,0.1)]
          hover:before:bg-[rgba(0,240,255,0.2)]
          hover:before:border-[rgba(255,255,255,0.2)]
          p-4
          shadow-[0_0_30px_rgba(0,0,0,0.1)]
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span 
          className={`
            block
            backface-hidden
            transition-all duration-1000
            bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#FF2D6E]
            bg-clip-text text-transparent
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
            relative
            after:content-[''] after:absolute after:inset-0
            after:bg-[linear-gradient(45deg,rgba(0,240,255,0.2),rgba(255,45,110,0.2))]
            after:mix-blend-overlay after:opacity-0
            hover:after:opacity-100
            glitch
            text-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
            [text-shadow:0_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(0,240,255,0.5)]
          `}
        >
          Build.Share.Brag
        </span>
        <span 
          className={`
            absolute top-0 left-0 w-full
            backface-hidden rotate-y-180
            transition-all duration-1000
            bg-gradient-to-r from-[#FF2D6E] via-[#8B5CF6] to-[#00F0FF]
            bg-clip-text text-transparent
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
            mix-blend-screen
            [text-shadow:0_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(255,45,110,0.5)]
          `}
        >
          Build.Share.Brag
        </span>
      </h1>
      <p className="
        text-xl mb-8 relative overflow-hidden
        text-gray-100 font-medium
        before:content-[''] before:absolute before:inset-0
        before:bg-[rgba(0,0,0,0.3)] before:backdrop-blur-sm
        before:rounded-lg before:border before:border-[rgba(255,255,255,0.1)]
        p-4
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]
        z-10
      ">
        Join the community of DIY enthusiasts sharing knowledge, builds, and passion for 3D printing
      </p>
      <div className="flex gap-4 justify-center">
        <Button 
          size="lg" 
          className="
            bg-[#00F0FF] hover:bg-[#00F0FF]/80
            text-black font-bold
            shadow-[0_0_20px_rgba(0,240,255,0.5)]
            hover:shadow-[0_0_30px_rgba(0,240,255,0.7)]
            transition-all duration-300
            relative overflow-hidden
            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
            before:translate-x-[-200%] hover:before:translate-x-[200%]
            before:transition-transform before:duration-700
          "
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          className="
            border-[#FF2D6E] text-[#FF2D6E]
            hover:bg-[#FF2D6E]/10
            shadow-[0_0_20px_rgba(255,45,110,0.3)]
            hover:shadow-[0_0_30px_rgba(255,45,110,0.5)]
            transition-all duration-300
          "
        >
          View Builds
        </Button>
      </div>
    </div>
  );
};