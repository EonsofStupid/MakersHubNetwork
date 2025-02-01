import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { ThemeProvider } from "@/providers/theme-provider";
import DesktopApp from "./platforms/desktop/DesktopApp";
import MobileApp from "./platforms/mobile/MobileApp";

export default function App() {
  const { isCompact } = useResponsiveLayout();
  
  return (
    <ThemeProvider defaultTheme="dark" enableSystem>
      {isCompact ? <MobileApp /> : <DesktopApp />}
    </ThemeProvider>
  );
}