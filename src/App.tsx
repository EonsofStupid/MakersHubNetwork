import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import DesktopApp from "./platforms/desktop/DesktopApp";
import MobileApp from "./platforms/mobile/MobileApp";

export default function App() {
  const { platform } = useResponsiveLayout();
  return platform === 'mobile' ? <MobileApp /> : <DesktopApp />;
}