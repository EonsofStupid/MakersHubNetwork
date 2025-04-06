
import React from 'react';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { CommunitySection } from '@/components/CommunitySection';
import { CallToAction } from '@/components/CallToAction';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProjects />
        <CommunitySection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
