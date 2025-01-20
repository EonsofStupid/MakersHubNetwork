import { Suspense } from "react";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Background } from "@/components/home/Background";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { ThemeInfoPopup } from "@/components/theme/ThemeInfoPopup";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <Background />
      </Suspense>
      
      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-background/20" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-background/20" />}>
          <Features />
        </Suspense>
      </div>

      <ThemeInfoPopup />
      <Footer />
    </div>
  );
};

export default Index;