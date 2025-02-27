
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
            <a href="/builder" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Start Building
            </a>
            <a href="/builds" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Browse Builds
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
