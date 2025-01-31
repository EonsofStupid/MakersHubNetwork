import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import DesktopApp from "./platforms/desktop/DesktopApp";
import MobileApp from "./platforms/mobile/MobileApp";

export default function App() {
  const { isMobile } = useResponsiveLayout();
  return isMobile ? <MobileApp /> : <DesktopApp />;
}