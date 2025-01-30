import { BackgroundEffects } from "@/features/home/components/background/BackgroundEffects";
import { HeroSection } from "./HeroSection";
import { FeaturedContent } from "./FeaturedContent";

export const DesktopHomeView = () => {
  return (
    <div className="min-h-screen">
      <BackgroundEffects />
      <HeroSection />
      <FeaturedContent />
    </div>
  );
};