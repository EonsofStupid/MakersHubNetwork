
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Code } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

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
    setTimeout(() => setIsPlaying(true), 50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-lg border border-primary/20 bg-background/40 backdrop-blur-xl group hover:border-primary/40 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-lg" />
      
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
            className="hover:bg-primary/20"
          >
            {isPlaying ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCode(!showCode)}
            className="hover:bg-primary/20"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative min-h-[120px] flex items-center justify-center p-4 rounded-md bg-background/40 border border-primary/20">
        <div className={cn(className, isPlaying && "animate-[your-animation]")}>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <EffectDemo
        name="Morph Header"
        description="Morphing clip-path animation with perspective"
        className="animate-morph-header"
        codeSnippet={`className="animate-morph-header"`}
      >
        <div className="w-full h-24 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg flex items-center justify-center text-xl font-bold">
          Morph Me
        </div>
      </EffectDemo>

      <EffectDemo
        name="Glitch Effect"
        description="Cyberpunk-inspired text glitch"
        className="glitch"
        codeSnippet={`className="glitch"`}
      >
        <h3 className="text-2xl font-bold">Glitch.Text</h3>
      </EffectDemo>

      <EffectDemo
        name="Mad Scientist Hover"
        description="Interactive hover effect with glow"
        className="mad-scientist-hover p-4 rounded-lg"
        codeSnippet={`className="mad-scientist-hover"`}
      >
        <span className="text-xl">Hover Me!</span>
      </EffectDemo>

      <EffectDemo
        name="Pulse Animation"
        description="Slow pulsing effect with opacity"
        className="animate-pulse-slow"
        codeSnippet={`className="animate-pulse-slow"`}
      >
        <div className="w-16 h-16 bg-primary/30 rounded-full" />
      </EffectDemo>

      <EffectDemo
        name="Stream Effect"
        description="Horizontal streaming animation"
        className="animate-stream-horizontal"
        codeSnippet={`className="animate-stream-horizontal"`}
      >
        <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      </EffectDemo>

      <EffectDemo
        name="Float Animation"
        description="Smooth floating movement"
        className="animate-float"
        codeSnippet={`className="animate-float"`}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg" />
      </EffectDemo>

      <EffectDemo
        name="Gradient Flow"
        description="Animated gradient background"
        className="animate-gradient"
        codeSnippet={`className="animate-gradient"`}
      >
        <div className="w-full h-24 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_200%]" />
      </EffectDemo>

      <EffectDemo
        name="3D Rotation"
        description="Y-axis rotation transform"
        className="animate-rotate-y perspective-1000"
        codeSnippet={`className="animate-rotate-y perspective-1000"`}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🔄</span>
        </div>
      </EffectDemo>
    </div>
  );
}
