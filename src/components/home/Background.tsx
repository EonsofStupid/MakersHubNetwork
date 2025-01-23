import { CSSProperties, memo, useEffect } from "react";
import { useAnimationStore } from "@/stores/animations/store";
import { useUIStore } from "@/stores/ui/store";
import { usePerformanceMonitor } from "@/stores/animations/utils";

const HorizontalStreams = memo(() => {
  const { startAnimation, stopAnimation, setCustomTiming } = useAnimationStore();
  const accentColor = useUIStore(state => state.theme.accentColor);

  useEffect(() => {
    const streamIds = Array.from({ length: 5 }, (_, i) => `h-stream-${i}`);
    
    streamIds.forEach(id => {
      setCustomTiming(id, 15 + Math.random() * 10);
      startAnimation(id);
    });

    return () => {
      streamIds.forEach(id => stopAnimation(id));
    };
  }, [startAnimation, stopAnimation, setCustomTiming]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={`h-stream-${i}`}
          className="absolute left-0 right-0 h-px bg-primary/30 animate-stream-horizontal"
          style={{
            top: `${Math.random() * 100}%`,
            '--stream-duration': `${15 + Math.random() * 10}s`,
            animationDelay: `-${Math.random() * 15}s`,
            backgroundColor: `${accentColor}30`,
          } as CSSProperties}
        >
          <div className="absolute inset-0 blur-sm bg-primary/50" style={{ backgroundColor: `${accentColor}50` }} />
        </div>
      ))}
    </div>
  );
});

const VerticalStreams = memo(() => {
  const { startAnimation, stopAnimation, setCustomTiming } = useAnimationStore();
  const accentColor = useUIStore(state => state.theme.accentColor);

  useEffect(() => {
    const streamIds = Array.from({ length: 6 }, (_, i) => `v-stream-${i}`);
    
    streamIds.forEach(id => {
      setCustomTiming(id, 8 + Math.random() * 7);
      startAnimation(id);
    });

    return () => {
      streamIds.forEach(id => stopAnimation(id));
    };
  }, [startAnimation, stopAnimation, setCustomTiming]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(2)].map((_, colIndex) => (
        <div
          key={`col-${colIndex}`}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${33 + colIndex * 33}%` }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={`v-stream-${colIndex}-${i}`}
              className="absolute top-0 w-px h-32 bg-primary/30 animate-stream-vertical"
              style={{
                left: `${Math.random() * 200 - 100}px`,
                '--stream-duration': `${8 + Math.random() * 7}s`,
                animationDelay: `-${Math.random() * 8}s`,
                backgroundColor: `${accentColor}30`,
              } as CSSProperties}
            >
              <div className="absolute inset-0 blur-sm bg-primary/50" style={{ backgroundColor: `${accentColor}50` }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

const FloatingElements = memo(() => {
  const { startAnimation, stopAnimation } = useAnimationStore();
  const accentColor = useUIStore(state => state.theme.accentColor);
  const checkPerformance = usePerformanceMonitor();

  useEffect(() => {
    const elementIds = Array.from({ length: 3 }, (_, i) => `float-${i}`);
    
    elementIds.forEach(id => startAnimation(id));
    
    return () => {
      elementIds.forEach(id => stopAnimation(id));
      checkPerformance();
    };
  }, [startAnimation, stopAnimation, checkPerformance]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-24 h-24 opacity-20 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + i * 2}s ease-in-out infinite`,
            transform: `rotate(${45 * i}deg)`,
            background: `linear-gradient(45deg, ${accentColor}, transparent)`,
            filter: 'blur(2px)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
      ))}
    </div>
  );
});

export const Background = memo(() => {
  const mode = useUIStore(state => state.theme.mode);

  return (
    <div className="fixed inset-0 -z-10">
      <div className={`absolute inset-0 bg-gradient-to-br ${
        mode === 'dark' 
          ? 'from-[#0F0A2E] via-[#094B51] to-[#1A1F2C]'
          : 'from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]'
      }`} />
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#00F0FF20 1px, transparent 1px),
            linear-gradient(to right, #00F0FF20 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center',
        }}
      />

      <HorizontalStreams />
      <VerticalStreams />
      <FloatingElements />

      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  );
});

Background.displayName = 'Background';