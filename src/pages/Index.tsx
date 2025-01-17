import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/home/Background";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <Background />
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <Hero />
        <Features />
      </div>

      <Footer />
    </div>
  );
};

export default Index;