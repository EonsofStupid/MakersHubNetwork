import { useCallback } from "react";
import Particles from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "tsparticles-slim";

export const BackgroundEffect = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-[#0F0A2E] overflow-hidden">
        <div className="absolute inset-0 opacity-30 animate-gradient bg-gradient-to-r from-[#0F0A2E] via-[#9F00FF] to-[#E1F500]" />
        
        {/* Mesh Gradient Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-[#9F00FF] rounded-full filter blur-[150px] opacity-20 animate-float top-[-100px] left-[-100px]" />
          <div className="absolute w-[400px] h-[400px] bg-[#E1F500] rounded-full filter blur-[150px] opacity-10 animate-float-delayed top-[40%] right-[-100px]" />
        </div>
      </div>

      {/* Particles Effect */}
      <Particles
        init={particlesInit}
        options={{
          background: {
            opacity: 0,
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.5,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        }}
      />
    </div>
  );
};