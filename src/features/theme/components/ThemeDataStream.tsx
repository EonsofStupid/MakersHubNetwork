import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';
import { cn } from '@/app/utils/cn';

interface ThemeDataStreamProps {
  className?: string;
  density?: number;
  speed?: number;
  opacity?: number;
}

export const ThemeDataStream = ({
  className,
  density = 50,
  speed = 2,
  opacity = 0.2,
}: ThemeDataStreamProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { themePreference } = useThemeContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const streams: { x: number; y: number; speed: number; length: number }[] = [];

    // Initialize streams
    for (let i = 0; i < density; i++) {
      streams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (Math.random() + 0.5) * speed,
        length: Math.random() * 20 + 10,
      });
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const animate = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw streams
      streams.forEach((stream) => {
        ctx.fillStyle = themePreference.mode === 'dark' 
          ? `rgba(0, 240, 255, ${opacity})`
          : `rgba(0, 0, 0, ${opacity})`;

        ctx.fillRect(stream.x, stream.y, 1, stream.length);
        stream.y = (stream.y + stream.speed) % canvas.height;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, opacity, themePreference.mode]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}; 