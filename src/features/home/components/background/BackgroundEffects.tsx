import { CSSProperties, memo, useCallback, useEffect, useRef } from "react";
import { useFrameMetrics } from "@/hooks/performance/useFrameMetrics";
import { useAnimationStore } from "@/stores/animations/store";

const HorizontalStreams = memo(() => {
  const streamRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    return () => {
      // Cleanup animation frames
      streamRefs.current.forEach(ref => {
        if (ref) {
          ref.style.animation = 'none';
        }
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <div
          key={`h-stream-${i}`}
          ref={el => streamRefs.current[i] = el}
          className="absolute left-0 right-0 h-px bg-primary/30 animate-stream-horizontal will-change-transform"
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
});

const VerticalStreams = memo(() => {
  const streamRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return () => {
      streamRefs.current.forEach(ref => {
        if (ref) {
          ref.style.animation = 'none';
        }
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(2)].map((_, colIndex) => (
        <div
          key={`col-${colIndex}`}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${33 + colIndex * 33}%` }}
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={`v-stream-${colIndex}-${i}`}
              ref={el => streamRefs.current[colIndex * 2 + i] = el}
              className="absolute top-0 w-px h-32 bg-primary/30 animate-stream-vertical will-change-transform"
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
});

const FloatingElements = memo(() => {
  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const cleanup = useCallback(() => {
    elementRefs.current.forEach(ref => {
      if (ref) {
        ref.style.animation = 'none';
      }
    });
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          ref={el => elementRefs.current[i] = el}
          className="absolute w-24 h-24 opacity-20 animate-float will-change-transform"
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
});

export const BackgroundEffects = memo(() => {
  useFrameMetrics("BackgroundEffects");
  const { isEnabled } = useAnimationStore();
  
  // Reduce number of particles based on performance
  const particleCount = useCallback(() => {
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 5;
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E] via-[#094B51] to-[#1A1F2C]" />
      
      {isEnabled && (
        <>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(#00F0FF20 1px, transparent 1px),
                linear-gradient(to right, #00F0FF20 1px, transparent 1px)
              `,
              backgroundSize: '4rem 4rem',
              backgroundPosition: 'center',
              willChange: 'transform',
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
        </>
      )}
    </div>
  );
});

BackgroundEffects.displayName = 'BackgroundEffects';
HorizontalStreams.displayName = 'HorizontalStreams';
VerticalStreams.displayName = 'VerticalStreams';
FloatingElements.displayName = 'FloatingElements';