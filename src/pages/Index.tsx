import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const IndexPage = () => {
  const { isMobile } = useResponsiveLayout();
  
  // Dynamically import the correct platform component
  const PlatformIndex = isMobile 
    ? require("@/platforms/mobile/pages/Index").default
    : require("@/platforms/desktop/pages/Index").default;

  return <PlatformIndex />;
};

export default IndexPage;