import { Suspense } from "react";
import { HeroContainer } from "@/shared/components/hero/HeroContainer";
import { FeaturesGrid } from "@/shared/components/features/FeaturesGrid";
import { BackgroundEffects } from "@/shared/components/background/BackgroundEffects";
import { useFrameMetrics } from "@/hooks/performance/useFrameMetrics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnimationStore } from "@/stores/animations/store";

const MobileIndexPage = () => {
  useFrameMetrics("MobileIndexPage");
  const { isEnabled: areAnimationsEnabled } = useAnimationStore();
  
  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen relative pb-[300px]">
        {areAnimationsEnabled && (
          <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
            <BackgroundEffects />
          </Suspense>
        )}
        
        <div className="container px-2 py-16 mx-auto relative">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-background/20" />}>
            <HeroContainer />
          </Suspense>
          
          <Suspense fallback={<div className="h-[200px] animate-pulse bg-background/20" />}>
            <FeaturesGrid />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  );
};

export default MobileIndexPage;