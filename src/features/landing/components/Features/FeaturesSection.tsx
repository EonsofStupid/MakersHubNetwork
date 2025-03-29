
import React from 'react';
import { useAtomValue } from 'jotai';
import { FeatureCard } from './FeatureCard';
import { featuresAtom } from '../../atoms';

export const FeaturesSection: React.FC = () => {
  const features = useAtomValue(featuresAtom);

  return (
    <section className="features-section container mx-auto px-4 relative">
      <h2 className="features-title">
        <span className="features-title-gradient">
          Powerful Tools for Makers
        </span>
      </h2>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard 
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
