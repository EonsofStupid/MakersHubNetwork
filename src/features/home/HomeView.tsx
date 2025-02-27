import { Suspense } from "react";
import { HeroContainer } from "./components/hero/HeroContainer";
import { FeaturesGrid } from "./components/features/FeaturesGrid";
import { BackgroundEffects } from "./components/background/BackgroundEffects";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

export const HomeView = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <BackgroundEffects />
      </Suspense>
      
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-background/20" />}>
          <HeroContainer />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-background/20" />}>
          <FeaturesGrid />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
};