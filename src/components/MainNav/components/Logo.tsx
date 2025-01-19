import { useState } from "react";
import { Link } from "react-router-dom";

export const Logo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <Link 
      to="/" 
      className="relative text-2xl font-bold transition-all duration-1000 hover:translate-y-[-8px] group"
      onMouseMove={handleMouseMove}
      style={{
        '--x': `${mousePosition.x}px`,
        '--y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary transition-all duration-1000 group-hover:from-[#FF2D6E] group-hover:to-[#FF2D6E] group-hover:animate-[glitch_0.3s_ease-in-out_infinite]">
        <span className="transition-colors duration-[5000ms] group-hover:text-[#FF2D6E]">M</span>
        <span className="transition-colors duration-[1200ms] group-hover:text-[#FF2D6E]">a</span>
        <span className="transition-colors duration-[7400ms] group-hover:text-[#FF2D6E]">k</span>
        <span className="transition-colors duration-[3600ms] group-hover:text-[#FF2D6E]">e</span>
        <span className="transition-colors duration-[2800ms] group-hover:text-[#FF2D6E]">r</span>
        <span className="transition-colors duration-[9000ms] group-hover:text-[#FF2D6E]">s</span>
        <span className="transition-colors duration-[7200ms] group-hover:text-[#FF2D6E]">I</span>
        <span className="transition-colors duration-[5400ms] group-hover:text-[#FF2D6E]">m</span>
        <span className="transition-colors duration-[2600ms] group-hover:text-[#FF2D6E]">p</span>
        <span className="transition-colors duration-[8800ms] group-hover:text-[#FF2D6E]">u</span>
        <span className="transition-colors duration-[3000ms] group-hover:text-[#FF2D6E]">l</span>
        <span className="transition-colors duration-[3200ms] group-hover:text-[#FF2D6E]">s</span>
        <span className="transition-colors duration-[3400ms] group-hover:text-[#FF2D6E]">e</span>
      </span>
      <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-full scale-150"></div>
    </Link>
  );
};
