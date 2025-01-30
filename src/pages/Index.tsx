import { usePlatformStore } from "@/utils/platform";
import { DesktopHomeView } from "@/routes/desktop/components/home/DesktopHomeView";
import { HomeView } from "@/features/home/HomeView";

const IndexPage = () => {
  const { platform } = usePlatformStore();
  
  return platform === 'desktop' ? <DesktopHomeView /> : <HomeView />;
};

export default IndexPage;