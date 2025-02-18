import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/app/stores/theme/store';
import { motion, useAnimation } from 'framer-motion';

interface ThemeDataStreamProps {
  className?: string;
  streamSpeed?: number;
  particleCount?: number;
}

export const ThemeDataStream = ({
  className = '',
  streamSpeed = 2,
  particleCount = 50,
}: ThemeDataStreamProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useThemeStore();
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; speed: number; size: number; color: string }[] = [];
    let animationFrameId: number;

    const colors = [
      currentTheme?.design_tokens?.primary || '#00F0FF',
      currentTheme?.design_tokens?.secondary || '#FF2D6E',
      currentTheme?.design_tokens?.accent || '#39FF14',
    ];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: (Math.random() + 0.2) * streamSpeed,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update particle position
        particle.y += particle.speed;

        // Reset particle when it goes off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme, streamSpeed, particleCount]);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
}; 