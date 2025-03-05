
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ThemeDataStreamProps {
  className?: string;
}

export function ThemeDataStream({ className }: ThemeDataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on actual size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight || 400; // Fallback height
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / 20) || 10; // Fallback to minimum columns
    const drops: number[] = new Array(columns).fill(0);

    const draw = () => {
      if (!ctx || !canvas) return;
      
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
    };

    // Use window.setInterval and store the ID
    intervalRef.current = window.setInterval(draw, 33);

    // Clean up function
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full opacity-20",
        className
      )}
    />
  );
}
