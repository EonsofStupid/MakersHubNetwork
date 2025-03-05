
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { ThemeDataStream } from "@/components/theme/ThemeDataStream";

const IndexPage = () => {
  const [activeEffects, setActiveEffects] = useState<{[key: string]: string}>({});

  // Function to apply random effect and color to a CTA on hover
  const applyRandomEffect = (id: string) => {
    const effects = ['cyber-glitch', 'cyber-particles', 'cyber-gradient-flow'];
    const colors = ['#00F0FF', '#FF2D6E', '#8B5CF6', '#F97316', '#0EA5E9'];
    
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setActiveEffects(prev => ({
      ...prev,
      [id]: randomEffect,
      [`${id}-color`]: randomColor
    }));
  };

  // Clear effects when mouse leaves
  const clearEffects = (id: string) => {
    setActiveEffects(prev => {
      const newEffects = {...prev};
      delete newEffects[id];
      delete newEffects[`${id}-color`];
      return newEffects;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <ThemeDataStream className="opacity-10" />
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 cyber-glow relative">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mad-scientist-hover">
              MakersImpulse
            </span>
          </h1>
          
          <div className="my-8 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading glitch relative mb-2">
              Build.Share.Brag
            </h2>
            <div className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
              A hub for passionate makers building, customizing, and sharing their 3D printer builds
            </div>
            
            <div className="subscribe-banner cyber-card p-4 md:p-6 max-w-xl mx-auto my-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-gradient"></div>
              <h3 className="text-xl font-bold text-primary mb-2">Join Our Maker Community</h3>
              <p className="text-muted-foreground mb-4">Get early access to new features and showcase your builds</p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex h-10 w-full rounded-md border border-primary/20 bg-background/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
                <button className="cyber-card cyber-glow inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Build CTA */}
            <a 
              href="/builder" 
              className={`cyber-card cyber-glow inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden ${activeEffects['build-cta']}`}
              onMouseEnter={() => applyRandomEffect('build-cta')}
              onMouseLeave={() => clearEffects('build-cta')}
              style={{
                '--effect-color': activeEffects['build-cta-color'] || '#00F0FF'
              } as React.CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Start Building</span>
              {activeEffects['build-cta'] === 'cyber-particles' && (
                <div className="absolute inset-0 particles-effect"></div>
              )}
            </a>
            
            {/* Browse CTA */}
            <a 
              href="/builds" 
              className={`glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden ${activeEffects['browse-cta']}`}
              onMouseEnter={() => applyRandomEffect('browse-cta')}
              onMouseLeave={() => clearEffects('browse-cta')}
              style={{
                '--effect-color': activeEffects['browse-cta-color'] || '#00F0FF'
              } as React.CSSProperties}
            >
              <span className="relative z-10">Browse Builds</span>
              {activeEffects['browse-cta'] === 'cyber-particles' && (
                <div className="absolute inset-0 particles-effect"></div>
              )}
            </a>
            
            {/* Community Hub CTA */}
            <a 
              href="/community" 
              className={`neo-blur inline-flex h-12 items-center justify-center rounded-md border border-secondary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium transition-colors hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,45,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden ${activeEffects['community-cta']}`}
              onMouseEnter={() => applyRandomEffect('community-cta')}
              onMouseLeave={() => clearEffects('community-cta')}
              style={{
                '--effect-color': activeEffects['community-cta-color'] || '#FF2D6E'
              } as React.CSSProperties}
            >
              <span className="relative z-10">Community Hub</span>
              {activeEffects['community-cta'] === 'cyber-particles' && (
                <div className="absolute inset-0 particles-effect"></div>
              )}
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
