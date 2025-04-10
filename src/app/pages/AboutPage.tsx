
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About MakersImpulse</h1>
        <p className="text-xl mb-8">Our mission is to connect 3D printing enthusiasts and makers</p>
        
        <div className="prose prose-invert max-w-none">
          <p>
            MakersImpulse was founded in 2023 by a group of passionate 3D printing enthusiasts
            who wanted to create a better platform for sharing knowledge, showcasing builds, and
            supporting each other in the maker community.
          </p>
          
          <p>
            Our platform is designed to help makers of all experience levels connect, learn, and
            improve their craft. From beginners looking for their first printer to experienced
            builders creating custom machines, we welcome everyone.
          </p>
          
          <h2>Our Values</h2>
          <ul>
            <li>Knowledge sharing and open source principles</li>
            <li>Community-driven development and support</li>
            <li>Innovation and experimentation</li>
            <li>Accessibility for makers of all levels</li>
          </ul>
          
          <p>
            Join us today and become part of a growing community dedicated to advancing the world
            of 3D printing and making.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
