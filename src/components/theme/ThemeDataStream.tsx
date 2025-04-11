
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeDataStreamProps {
  className?: string;
}

export function ThemeDataStream({ className }: ThemeDataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on actual size
    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight || 400; // Fallback height
    };

    try {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const columns = Math.floor(canvas.width / 20) || 10; // Fallback to minimum columns
      const drops: number[] = new Array(columns).fill(0);

      const draw = () => {
        if (!ctx || !canvas || !isActive) return;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00F0FF";
        ctx.font = "15px monospace";

        for (let i = 0; i < drops.length; i++) {
          const text = Math.random() > 0.5 ? "0" : "1";
          const x = i * 20;
          const y = drops[i] * 20;

          if (x < canvas.width && y < canvas.height) {
            ctx.fillText(text, x, y);
          }

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }

        // Use RAF for better performance and avoid infinite loop
        if (isActive) {
          animationFrameRef.current = requestAnimationFrame(draw);
        }
      };
      
      // Start animation - avoid nested state updates
      animationFrameRef.current = requestAnimationFrame(draw);

      // Clean up function
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        window.removeEventListener('resize', resizeCanvas);
        setIsActive(false);
        
        // Extra cleanup to ensure canvas is cleared
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
    } catch (error) {
      console.error("Error in ThemeDataStream:", error);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('resize', resizeCanvas);
        setIsActive(false);
      };
    }
  }, [isActive]); // Only depend on isActive, not any other props

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full opacity-20 pointer-events-none",
        className
      )}
    />
  );
}
