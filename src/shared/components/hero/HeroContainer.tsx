import { useState, useCallback } from "react";
import { HeroContent } from "./HeroContent";
import { useFrameMetrics } from "@/hooks/performance/useFrameMetrics";

export const HeroContainer = () => {
  useFrameMetrics("HeroContainer");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsFlipped(false);
  }, []);

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}
    >
      <HeroContent />
    </div>
  );
};
