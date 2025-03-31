
import { cn } from '@/lib/utils';

// Custom scrollbar style for admin sections
export const scrollbarStyle = cn(
  "scrollbar-thin scrollbar-thumb-[var(--impulse-primary)]/20 scrollbar-track-transparent",
  "hover:scrollbar-thumb-[var(--impulse-primary)]/40"
);

// Glass morphism style with varying intensities
export const glassMorphism = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  switch (intensity) {
    case 'light':
      return cn(
        "backdrop-blur-sm bg-black/20 border border-white/10"
      );
    case 'medium':
      return cn(
        "backdrop-blur-md bg-black/30 border border-white/20"
      );
    case 'heavy':
      return cn(
        "backdrop-blur-xl bg-black/40 border border-white/30"
      );
  }
};

// Creates a text gradient style
export const textGradient = (from: string = 'white', to: string = 'white/70') => {
  return {
    background: `linear-gradient(to bottom right, ${from}, ${to})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
};

// CSS variables for the impulse theme
export const impulseThemeVariables = {
  '--impulse-primary': '#00F0FF',
  '--impulse-secondary': '#FF2D6E',
  '--impulse-bg-main': 'rgba(15, 15, 15, 0.95)',
  '--impulse-bg-card': 'rgba(16, 20, 24, 0.7)',
  '--impulse-bg-hover': 'rgba(25, 25, 30, 0.6)',
  '--impulse-bg-overlay': 'rgba(25, 25, 30, 0.85)',
  '--impulse-text-primary': '#FFFFFF',
  '--impulse-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--impulse-border-normal': 'rgba(0, 240, 255, 0.2)',
  '--impulse-border-hover': 'rgba(0, 240, 255, 0.4)',
  '--impulse-border-active': 'rgba(0, 240, 255, 0.6)',
};

// Random animation durations for more variety
export const getRandomAnimationDuration = () => {
  const durations = [2, 3, 4, 5];
  return durations[Math.floor(Math.random() * durations.length)];
};

// Random delays for animation staggering
export const getRandomDelay = () => {
  return Math.random() * 2;
};
