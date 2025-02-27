
import { Suspense } from "react";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { HeroContainer } from "@/features/home/components/hero/HeroContainer";
import { FeaturesGrid } from "@/features/home/components/features/FeaturesGrid";
import { BackgroundEffects } from "@/features/home/components/background/BackgroundEffects";

const IndexPage = () => {
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

export default IndexPage;
