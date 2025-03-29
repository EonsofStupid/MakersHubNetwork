
import React from 'react';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense, memo } from 'react';
import { ThemeDataStream } from '@/components/theme/ThemeDataStream';
import { SimpleCyberText } from '@/components/theme/SimpleCyberText';
import { HeroSection } from './components/Hero/HeroSection';
import { FeaturesSection } from './components/Features/FeaturesSection';
import { BuildShowcaseSection } from './components/BuildShowcase/BuildShowcaseSection';

// Import CSS
import './styles/index.css';

// Memoize components that don't need to re-render often
const MemoizedThemeDataStream = memo(ThemeDataStream);

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <ErrorBoundary fallback={<div>Something went wrong with the data stream.</div>}>
          <Suspense fallback={<div className="opacity-10">Loading...</div>}>
            <MemoizedThemeDataStream className="opacity-10" />
          </Suspense>
        </ErrorBoundary>
        
        <HeroSection 
          title={<span className="hero-title-gradient">MakersImpulse</span>}
          subtitle={<SimpleCyberText text="Build.Share.Brag" />}
          description="A hub for passionate makers building, customizing, and sharing their 3D printer builds"
          ctaButtons={[
            {
              id: "build-cta",
              label: "Start Building",
              href: "/builder",
              primary: true,
              onHover: (id) => {},
              onLeave: (id) => {}
            },
            {
              id: "browse-cta",
              label: "Browse Builds",
              href: "/builds",
              onHover: (id) => {},
              onLeave: (id) => {}
            },
            {
              id: "community-cta",
              label: "Community Hub",
              href: "/community",
              secondary: true,
              onHover: (id) => {},
              onLeave: (id) => {}
            }
          ]}
        />
      </div>

      {/* Features Section */}
      <FeaturesSection />
      
      {/* Build Showcase Section */}
      <BuildShowcaseSection />

      <Footer />
    </div>
  );
};

export default IndexPage;
