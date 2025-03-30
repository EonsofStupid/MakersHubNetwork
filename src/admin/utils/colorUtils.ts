
/**
 * Color Utilities for the Admin Interface
 */

// Predefined color palette with cyberpunk theme
export const cyberColors = {
  primary: {
    base: "#00F0FF", // Cyan
    glow: "0 0 15px rgba(0, 240, 255, 0.7)",
    hover: "rgba(0, 240, 255, 0.2)"
  },
  secondary: {
    base: "#FF2D6E", // Pink
    glow: "0 0 15px rgba(255, 45, 110, 0.7)",
    hover: "rgba(255, 45, 110, 0.2)"
  },
  tertiary: {
    base: "#00FF9D", // Green
    glow: "0 0 15px rgba(0, 255, 157, 0.7)",
    hover: "rgba(0, 255, 157, 0.2)"
  },
  quaternary: {
    base: "#FFB400", // Amber
    glow: "0 0 15px rgba(255, 180, 0, 0.7)",
    hover: "rgba(255, 180, 0, 0.2)"
  },
  quinary: {
    base: "#8B5CF6", // Purple
    glow: "0 0 15px rgba(139, 92, 246, 0.7)",
    hover: "rgba(139, 92, 246, 0.2)"
  }
};

// Color theme sets for randomized palette generation
export const colorThemes = [
  // Neon theme - bright vibrant colors
  {
    primary: "#00F0FF",
    secondary: "#FF2D6E",
    accent: "#00FF9D",
    background: "rgba(15, 15, 30, 0.9)",
    text: "#FFFFFF"
  },
  // Synthwave theme - pink, purple and blue
  {
    primary: "#F72585",
    secondary: "#7209B7",
    accent: "#4CC9F0",
    background: "rgba(20, 10, 30, 0.9)",
    text: "#FFFFFF"
  },
  // Hacker theme - green and black
  {
    primary: "#00FF41",
    secondary: "#96FF00",
    accent: "#14B8A6",
    background: "rgba(0, 10, 5, 0.9)",
    text: "#D1FAE5"
  },
  // Cybercity theme - blue and orange
  {
    primary: "#0EA5E9",
    secondary: "#FB923C",
    accent: "#6366F1",
    background: "rgba(5, 15, 30, 0.9)",
    text: "#FFFFFF"
  }
];

// Generate a random color set
export const getRandomColorTheme = () => {
  const randomIndex = Math.floor(Math.random() * colorThemes.length);
  return colorThemes[randomIndex];
};

// Generate a random glow effect
export const getRandomGlow = () => {
  const colors = [
    cyberColors.primary.glow,
    cyberColors.secondary.glow,
    cyberColors.tertiary.glow,
    cyberColors.quaternary.glow,
    cyberColors.quinary.glow
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get a color based on ID (deterministic)
export const getColorFromId = (id: string) => {
  const colors = [
    cyberColors.primary.base,
    cyberColors.secondary.base,
    cyberColors.tertiary.base,
    cyberColors.quaternary.base,
    cyberColors.quinary.base
  ];
  
  // Create a simple hash from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get index based on hash
  const colorIndex = Math.abs(hash) % colors.length;
  
  return colors[colorIndex];
};

// Get a glow effect based on ID (deterministic)
export const getGlowFromId = (id: string) => {
  const glows = [
    cyberColors.primary.glow,
    cyberColors.secondary.glow,
    cyberColors.tertiary.glow,
    cyberColors.quaternary.glow,
    cyberColors.quinary.glow
  ];
  
  // Create a simple hash from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get index based on hash
  const glowIndex = Math.abs(hash) % glows.length;
  
  return glows[glowIndex];
};

// Apply a color with alpha transparency
export const applyColorAlpha = (color: string, alpha: number) => {
  if (color.startsWith('#')) {
    // HEX color - convert to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else if (color.startsWith('rgb')) {
    // Already rgb or rgba - extract values and apply new alpha
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      const [r, g, b] = rgbValues;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  
  // Fallback
  return color;
};
