import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroContent = () => {
  return (
    <div className="max-w-3xl mx-auto text-center animate-fade-up">
      <h1 
        className={`
          text-6xl font-bold mb-6 
          perspective-[1000px] inline-block
          transition-all duration-700
          cursor-pointer
          relative
          before:content-[''] before:absolute before:inset-0
          before:bg-[rgba(0,240,255,0.1)] before:backdrop-blur-sm
          before:rounded-xl before:border before:border-[rgba(255,255,255,0.1)]
          hover:before:bg-[rgba(0,240,255,0.2)]
          hover:before:border-[rgba(255,255,255,0.2)]
          p-4
          shadow-[0_0_30px_rgba(0,0,0,0.1)]
        `}
      >
        <span className="
          block
          bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#FF2D6E]
          bg-clip-text text-transparent
          relative
          after:content-[''] after:absolute after:inset-0
          after:bg-[linear-gradient(45deg,rgba(0,240,255,0.2),rgba(255,45,110,0.2))]
          after:mix-blend-overlay after:opacity-0
          hover:after:opacity-100
          glitch
          text-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
          [text-shadow:0_2px_4px_rgba(0,0,0,0.3),0_0_10px_rgba(0,240,255,0.5)]
        ">
          Build.Share.Brag
        </span>
      </h1>
      <p className="
        text-xl mb-8 relative overflow-hidden
        text-white font-medium
        p-4
        z-10
        rounded-lg
        before:content-[''] before:absolute before:inset-0 before:z-[-1]
        before:bg-[rgba(0,0,0,0.6)] before:backdrop-blur-sm
        before:border before:border-[rgba(255,255,255,0.15)]
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]
        [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]
      ">
        Join the community of DIY enthusiasts sharing knowledge, builds, and passion for 3D printing
      </p>
      <div className="flex gap-4 justify-center">
        <Button 
          size="lg" 
          className="
            bg-[#00F0FF] hover:bg-[#00F0FF]/80
            text-black font-bold
            shadow-[0_0_20px_rgba(0,240,255,0.5)]
            hover:shadow-[0_0_30px_rgba(0,240,255,0.7)]
            transition-all duration-300
            relative overflow-hidden
            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
            before:translate-x-[-200%] hover:before:translate-x-[200%]
            before:transition-transform before:duration-700
          "
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          className="
            border-[#FF2D6E] text-[#FF2D6E]
            hover:bg-[#FF2D6E]/10
            shadow-[0_0_20px_rgba(255,45,110,0.3)]
            hover:shadow-[0_0_30px_rgba(255,45,110,0.5)]
            transition-all duration-300
          "
        >
          View Builds
        </Button>
      </div>
    </div>
  );
};