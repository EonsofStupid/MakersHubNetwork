import { useEffect } from "react";
import { DesktopHomeView } from "./DesktopHomeView";
import { MobileHomeView } from "./MobileHomeView";
import { usePlatformStore, detectPlatform } from "@/utils/platform";

export const HomeView = () => {
  const { platform, setPlatform } = usePlatformStore();

  useEffect(() => {
    const handleResize = () => {
      setPlatform(detectPlatform());
    };

    // Initial detection
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setPlatform]);

  return platform === 'desktop' ? <DesktopHomeView /> : <MobileHomeView />;
};