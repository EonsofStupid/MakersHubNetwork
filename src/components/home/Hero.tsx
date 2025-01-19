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

  // Random pulse effect
  const startPulseInterval = useCallback(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = startPulseInterval();
    return cleanup;
  }, [startPulseInterval]);

  return (
    <div className="max-w-3xl mx-auto text-center animate-fade-up">
      <h1 
        className={`
          text-5xl font-bold mb-6 
          perspective-[1000px] inline-block
          transition-all duration-700 
          cursor-pointer
          ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span 
          className={`
            block
            backface-hidden
            transition-colors duration-1000
            bg-gradient-to-r 
            ${isPulsing 
              ? 'from-[#1A1F2C] via-primary to-secondary' 
              : 'from-primary to-secondary'
            }
            bg-clip-text text-transparent
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
          `}
        >
          Build.Share.Brag
        </span>
        <span 
          className={`
            absolute top-0 left-0 w-full
            backface-hidden rotate-y-180
            transition-colors duration-1000
            bg-gradient-to-r from-secondary via-primary to-[#1A1F2C]
            bg-clip-text text-transparent
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
          `}
        >
          Build.Share.Brag
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Join the community of DIY enthusiasts sharing knowledge, builds, and passion for 3D printing
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline">
          View Builds
        </Button>
      </div>
    </div>
  );
};