
import React from 'react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Features</h1>
        <p className="text-xl mb-8">Explore what our platform has to offer</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-primary/20 rounded-lg p-6 bg-background/30">
            <h2 className="text-2xl font-bold mb-4">Build Showcase</h2>
            <p>Share your 3D printer builds with the community</p>
          </div>
          
          <div className="border border-primary/20 rounded-lg p-6 bg-background/30">
            <h2 className="text-2xl font-bold mb-4">Community Support</h2>
            <p>Get help with your projects from experienced makers</p>
          </div>
          
          <div className="border border-primary/20 rounded-lg p-6 bg-background/30">
            <h2 className="text-2xl font-bold mb-4">Firmware Customization</h2>
            <p>Share and discover custom firmware configurations</p>
          </div>
          
          <div className="border border-primary/20 rounded-lg p-6 bg-background/30">
            <h2 className="text-2xl font-bold mb-4">Parts Marketplace</h2>
            <p>Find upgrades and replacements for your printer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
