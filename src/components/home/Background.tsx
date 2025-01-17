import { CSSProperties } from "react";

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E] via-[#094B51] to-[#1A1F2C] bg-[length:400%_400%] animate-gradient" />
      
      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(#00F0FF20 1px, transparent 1px),
            linear-gradient(to right, #00F0FF20 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />

      {/* Digital Rain Effect - Horizontal Streams */}
      <HorizontalStreams />

      {/* Digital Rain Effect - Vertical Streams */}
      <VerticalStreams />

      {/* Floating elements */}
      <FloatingElements />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  );
};

const HorizontalStreams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <div
        key={`h-stream-${i}`}
        className="absolute left-0 right-0 h-px bg-primary/30 animate-stream-horizontal"
        style={{
          top: `${Math.random() * 100}%`,
          '--stream-duration': `${15 + Math.random() * 10}s`,
          animationDelay: `-${Math.random() * 15}s`,
        } as CSSProperties}
      >
        <div className="absolute inset-0 blur-sm bg-primary/50" />
      </div>
    ))}
  </div>
);

const VerticalStreams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(2)].map((_, colIndex) => (
      <div
        key={`col-${colIndex}`}
        className="absolute top-0 bottom-0 w-px"
        style={{ left: `${33 + colIndex * 33}%` }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={`v-stream-${colIndex}-${i}`}
            className="absolute top-0 w-px h-32 bg-primary/30 animate-stream-vertical"
            style={{
              left: `${Math.random() * 200 - 100}px`,
              '--stream-duration': `${8 + Math.random() * 7}s`,
              animationDelay: `-${Math.random() * 8}s`,
            } as CSSProperties}
          >
            <div className="absolute inset-0 blur-sm bg-primary/50" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-24 h-24 opacity-20 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${10 + i * 2}s ease-in-out infinite`,
          transform: `rotate(${45 * i}deg)`,
          background: `linear-gradient(45deg, ${i % 2 ? '#00F0FF' : '#FF2D6E'}, transparent)`,
          filter: 'blur(2px)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
    ))}
  </div>
);