
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { useEffect, useState, useCallback, Suspense, memo } from "react";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";

// Memoize components that don't need to re-render often
const MemoizedThemeDataStream = memo(ThemeDataStream);

// Create a separate component for the CTA buttons to prevent unnecessary re-renders
const ActionButtons = memo(({ onHover, onLeave }: { 
  onHover: (id: string) => void, 
  onLeave: (id: string) => void 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Build CTA */}
      <a 
        href="/builder" 
        className="cyber-card inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
        onMouseEnter={() => onHover('build-cta')}
        onMouseLeave={() => onLeave('build-cta')}
        id="build-cta"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className="relative z-10">Start Building</span>
      </a>
      
      {/* Browse CTA */}
      <a 
        href="/builds" 
        className="glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
        onMouseEnter={() => onHover('browse-cta')}
        onMouseLeave={() => onLeave('browse-cta')}
        id="browse-cta"
      >
        <span className="relative z-10">Browse Builds</span>
      </a>
      
      {/* Community Hub CTA */}
      <a 
        href="/community" 
        className="neo-blur inline-flex h-12 items-center justify-center rounded-md border border-secondary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium transition-colors hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,45,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
        onMouseEnter={() => onHover('community-cta')}
        onMouseLeave={() => onLeave('community-cta')}
        id="community-cta"
      >
        <span className="relative z-10">Community Hub</span>
      </a>
    </div>
  );
});

// Prevent unnecessary re-renders by memoizing the title
const PageTitle = memo(() => (
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative">
    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mad-scientist-hover">
      MakersImpulse
    </span>
  </h1>
));

// Memoize the subtitle section
const PageSubtitle = memo(() => (
  <>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading relative mb-2">
      <SimpleCyberText text="Build.Share.Brag" />
    </h2>
    <div className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
      A hub for passionate makers building, customizing, and sharing their 3D printer builds
    </div>
  </>
));

// Memoize the subscription form to prevent unnecessary re-renders
const SubscriptionForm = memo(() => (
  <div className="subscribe-banner cyber-card p-4 md:p-6 max-w-xl mx-auto my-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"></div>
    <h3 className="text-xl font-bold text-primary mb-2 relative z-10">Join Our Maker Community</h3>
    <p className="text-muted-foreground mb-4 relative z-10">Get early access to new features and showcase your builds</p>
    
    <div className="flex flex-col sm:flex-row gap-2 relative z-10">
      <input 
        type="email" 
        placeholder="Your email" 
        className="flex h-10 w-full rounded-md border border-primary/20 bg-background/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />
      <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
        Subscribe
      </button>
    </div>
  </div>
));

const IndexPage = () => {
  // Use our new effects system hook
  const { 
    applyRandomEffect, 
    removeEffect, 
    getEffectForElement 
  } = useThemeEffects({
    debounceDelay: 100, 
    maxActiveEffects: 5
  });

  // Function to apply random effect to a CTA on hover
  const handleHover = useCallback((id: string) => {
    applyRandomEffect(id, {
      types: ['glitch', 'gradient', 'cyber', 'pulse'],
      colors: ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration: 2000
    });
  }, [applyRandomEffect]);

  // Clear effects when mouse leaves
  const handleLeave = useCallback((id: string) => {
    removeEffect(`${id}-glitch`);
    removeEffect(`${id}-gradient`);
    removeEffect(`${id}-cyber`);
    removeEffect(`${id}-pulse`);
  }, [removeEffect]);

  // Get effects for each CTA
  const buildEffect = getEffectForElement('build-cta');
  const browseEffect = getEffectForElement('browse-cta');
  const communityEffect = getEffectForElement('community-cta');

  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <ErrorBoundary fallback={<div>Something went wrong with the data stream.</div>}>
          <Suspense fallback={<div className="opacity-10">Loading...</div>}>
            <MemoizedThemeDataStream className="opacity-10" />
          </Suspense>
        </ErrorBoundary>
        
        <div className="text-center">
          <PageTitle />
          
          <div className="my-8 relative overflow-hidden">
            <PageSubtitle />
            <SubscriptionForm />
          </div>
          
          <ActionButtons onHover={handleHover} onLeave={handleLeave} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
