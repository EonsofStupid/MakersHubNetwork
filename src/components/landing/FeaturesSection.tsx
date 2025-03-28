
import React from "react";
import { FeatureCta } from "./FeatureCta";
import "./styles/feature-cta.css"; // Make sure we import our styles

export const FeaturesSection = () => {
  // Define our features data
  const features = [
    {
      type: "database",
      title: "3D Printer Database",
      description: "Access our comprehensive database of 3D printer builds, parts, and specifications.",
      ctaText: "Explore Database",
      ctaLink: "/database"
    },
    {
      type: "forum",
      title: "Maker Forums",
      description: "Join discussions with fellow makers, share your knowledge, and get help with your builds.",
      ctaText: "Join Forums",
      ctaLink: "/forums"
    },
    {
      type: "chat",
      title: "Live Chat",
      description: "Get real-time advice and connect with makers around the world through our chat platform.",
      ctaText: "Start Chatting",
      ctaLink: "/chat"
    }
  ];

  return (
    <section className="py-12 container mx-auto px-4 relative">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
          Powerful Tools for Makers
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCta 
            key={index}
            type={feature.type}
            title={feature.title}
            description={feature.description}
            ctaText={feature.ctaText}
            ctaLink={feature.ctaLink}
          />
        ))}
      </div>
    </section>
  );
};
