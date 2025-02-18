
import { Suspense } from "react";
import { BackgroundEffects } from "@/features/home/components/background/BackgroundEffects";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

const IndexPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <BackgroundEffects />
      </Suspense>
      
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient leading-tight">
            Welcome to MakersImpulse
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            A hub for makers building, customizing, and sharing their 3D printer builds.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-12">
            <div className="cyber-card p-6 hover:cyber-glow">
              <h3 className="text-xl font-bold mb-2 text-gradient">Build</h3>
              <p className="text-muted-foreground">Create and customize your perfect 3D printer setup</p>
            </div>
            <div className="cyber-card p-6 hover:cyber-glow">
              <h3 className="text-xl font-bold mb-2 text-gradient">Share</h3>
              <p className="text-muted-foreground">Show off your builds and help others learn</p>
            </div>
            <div className="cyber-card p-6 hover:cyber-glow">
              <h3 className="text-xl font-bold mb-2 text-gradient">Brag</h3>
              <p className="text-muted-foreground">Join our community of passionate makers</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
