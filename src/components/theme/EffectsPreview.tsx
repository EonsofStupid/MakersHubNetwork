import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EffectDemoProps {
  name: string;
  description: string;
  className?: string;
  codeSnippet: string;
  children: React.ReactNode;
}

const EffectDemo = ({ name, description, className, codeSnippet, children }: EffectDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const replay = () => {
    setIsPlaying(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPlaying(true);
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-lg border border-primary/20 bg-background/40 backdrop-blur-xl group hover:border-primary/40 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-lg opacity-50" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-primary">{name}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={replay}
            className="hover:bg-primary/20 transition-colors"
          >
            {isPlaying ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCode(!showCode)}
            className="hover:bg-primary/20 transition-colors"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative min-h-[200px] flex items-center justify-center p-4 rounded-md bg-background/40 border border-primary/20 overflow-hidden perspective-1000">
        <div className={cn(
          "transition-all duration-300",
          isPlaying && className
        )}>
          {children}
        </div>
      </div>

      {showCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 rounded-md bg-background/60 border border-primary/20 overflow-x-auto"
        >
          <pre className="text-sm text-primary-foreground">
            <code>{codeSnippet}</code>
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
};

export function EffectsPreview() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <EffectDemo
        name="Stream Effect"
        description="Horizontal streaming animation with opacity transitions"
        className="w-full relative"
        codeSnippet={`className="animate-stream-horizontal"
style={{ "--stream-duration": "8s" }}`}
      >
        <div 
          className="w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-stream-horizontal" 
          style={{ "--stream-duration": "8s" } as React.CSSProperties}
        />
      </EffectDemo>

      <EffectDemo
        name="Gradient Flow"
        description="Smooth gradient background animation"
        className="animate-gradient"
        codeSnippet={`className="animate-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%]"`}
      >
        <div className="w-full h-32 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%] rounded-lg shadow-lg" />
      </EffectDemo>

      <EffectDemo
        name="3D Rotation"
        description="Smooth Y-axis rotation with perspective"
        className="group-hover:animate-rotate-y"
        codeSnippet={`className="animate-rotate-y perspective-1000 backface-hidden"`}
      >
        <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-sm border border-primary/30">
          <span className="text-2xl font-bold text-primary">3D</span>
        </div>
      </EffectDemo>

      <EffectDemo
        name="Morph Header"
        description="Morphing clip-path animation with perspective"
        className="animate-morph-header"
        codeSnippet={`className="animate-morph-header"`}
      >
        <div className="w-full h-32 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg flex items-center justify-center text-xl font-bold shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-sm">
          <span className="text-primary">Morph Me</span>
        </div>
      </EffectDemo>

      <EffectDemo
        name="Glitch Effect"
        description="Cyberpunk-inspired text glitch"
        className="glitch"
        codeSnippet={`className="glitch"`}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Glitch.Text
        </h3>
      </EffectDemo>

      <EffectDemo
        name="Mad Scientist"
        description="Interactive hover effect with glow"
        className="mad-scientist-hover p-6 rounded-lg"
        codeSnippet={`className="mad-scientist-hover"`}
      >
        <span className="text-2xl font-bold text-primary">Hover Me!</span>
      </EffectDemo>
    </div>
  );
}