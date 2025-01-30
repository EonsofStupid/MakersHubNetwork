import { Suspense, useCallback } from "react";
import { HeroContainer } from "./components/hero/HeroContainer";
import { FeaturesGrid } from "./components/features/FeaturesGrid";
import { BackgroundEffects } from "./components/background/BackgroundEffects";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { useFrameMetrics } from "@/hooks/performance/useFrameMetrics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnimationStore } from "@/stores/animations/store";

export const HomeView = () => {
  useFrameMetrics("HomeView");
  const { isEnabled: areAnimationsEnabled } = useAnimationStore();
  
  const renderBackground = useCallback(() => (
    <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
      <BackgroundEffects />
    </Suspense>
  ), []);
  
  const renderHero = useCallback(() => (
    <Suspense fallback={<div className="h-[400px] animate-pulse bg-background/20" />}>
      <HeroContainer />
    </Suspense>
  ), []);
  
  const renderFeatures = useCallback(() => (
    <Suspense fallback={<div className="h-[300px] animate-pulse bg-background/20" />}>
      <FeaturesGrid />
    </Suspense>
  ), []);

  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen relative pb-[400px]">
        {areAnimationsEnabled && renderBackground()}
        
        <MainNav />
        
        <div className="container px-4 py-24 mx-auto relative">
          {renderHero()}
          {renderFeatures()}
        </div>

        <Footer />
      </div>
    </ScrollArea>
  );
};