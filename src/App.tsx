import { useEffect } from 'react';
import DesktopApp from './platforms/desktop/DesktopApp';
import MobileApp from './platforms/mobile/MobileApp';
import { usePlatformStore, detectPlatform } from '@/utils/platform';

export default function App() {
  const { platform, setPlatform } = usePlatformStore();

  useEffect(() => {
    const currentPlatform = detectPlatform();
    setPlatform(currentPlatform);
  }, [setPlatform]);

  return platform === 'mobile' ? <MobileApp /> : <DesktopApp />;
}