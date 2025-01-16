import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

export const BackgroundEffect = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-[#094B51] overflow-hidden">
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-30 bg-gradient-to-r from-[#0F0A2E] via-[#9F00FF] to-[#E1F500] bg-[length:300%_300%] animate-gradient"
        />
        
        {/* Grid Lines Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="relative w-full h-full">
            {/* Horizontal Lines */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-[#9F00FF] transform animate-pulse-slow"
                style={{ top: `${(i + 1) * 5}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
            {/* Vertical Lines */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-[#00F0FF] transform animate-pulse-slow"
                style={{ left: `${(i + 1) * 5}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Mesh Gradient Effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-[800px] h-[800px] bg-[#9F00FF] rounded-full filter blur-[180px] opacity-20 animate-float mix-blend-screen"
            style={{
              top: '-20%',
              left: '-10%',
            }}
          />
          <div 
            className="absolute w-[600px] h-[600px] bg-[#E1F500] rounded-full filter blur-[150px] opacity-10 animate-float-delayed mix-blend-screen"
            style={{
              top: '40%',
              right: '-10%',
            }}
          />
          <div 
            className="absolute w-[700px] h-[700px] bg-[#9F00FF] rounded-full filter blur-[170px] opacity-15 animate-float mix-blend-screen"
            style={{
              bottom: '-20%',
              left: '30%',
            }}
          />
        </div>
      </div>

      {/* Particles Effect */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            opacity: 0,
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                width: 800
              }
            },
            color: {
              value: ["#9F00FF", "#E1F500", "#00F0FF"],
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              animation: {
                enable: true,
                speed: 1,
                startValue: "max",
                destroy: "min",
                sync: false,
                minimumValue: 0.1
              }
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                startValue: "min",
                destroy: "max",
                sync: false,
                minimumValue: 0.1
              }
            },
            links: {
              enable: true,
              distance: 150,
              color: "#9F00FF",
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "bounce",
              },
              trail: {
                enable: true,
                length: 4,
                fillColor: "#094B51",
              },
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5,
                },
              },
              push: {
                quantity: 4,
              },
            },
          },
        }}
      />
    </div>
  );
};