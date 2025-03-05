
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

const IndexPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MakersImpulse
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A hub for passionate makers building, customizing, and sharing their 3D printer builds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/builder" 
              className="cyber-card cyber-glow inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Start Building</span>
            </a>
            <a 
              href="/builds" 
              className="glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="relative z-10">Browse Builds</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
