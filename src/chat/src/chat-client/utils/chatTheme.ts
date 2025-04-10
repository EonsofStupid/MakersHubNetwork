
/**
 * Glass style class for use across chat components
 * This provides the teal-tinted frosted glass look
 */
export const glassCardClass = `
  backdrop-filter: blur(12px)
  bg-teal-300/10
  border border-teal-500/20
  shadow-lg shadow-teal-400/10
  rounded-2xl
  ring-1 ring-inset ring-teal-300/20
`;

/**
 * Enhanced glass styles with varying depth levels
 */
export const glassStyles = {
  light: `
    backdrop-filter: blur(8px)
    bg-teal-300/5
    border border-teal-500/10
    shadow-sm
    rounded-xl
  `,
  
  medium: `
    backdrop-filter: blur(12px)
    bg-teal-300/10
    border border-teal-500/20
    shadow-lg shadow-teal-400/10
    rounded-2xl
    ring-1 ring-inset ring-teal-300/20
  `,
  
  deep: `
    backdrop-filter: blur(16px)
    bg-gradient-to-br from-teal-900/20 via-black/50 to-teal-800/10
    border border-teal-500/30
    shadow-xl shadow-teal-500/20
    rounded-2xl
    ring-1 ring-inset ring-teal-400/30
  `
};

/**
 * Layered background gradient styles for different components
 */
export const gradientStyles = {
  container: 'bg-gradient-to-br from-black/40 via-teal-900/10 to-black/40',
  header: 'bg-gradient-to-r from-teal-900/30 to-black/40',
  sidebar: 'bg-gradient-to-br from-black/50 via-teal-950/20 to-black/40',
  message: {
    ai: 'bg-gradient-to-br from-teal-900/20 to-black/60',
    user: 'bg-gradient-to-br from-teal-600/40 to-teal-800/30'
  }
};

/**
 * Shadow styles for depth effects
 */
export const shadowStyles = {
  subtle: 'shadow-sm shadow-teal-500/5',
  normal: 'shadow-md shadow-teal-500/10',
  elevated: 'shadow-lg shadow-teal-500/15',
  floating: 'shadow-xl shadow-teal-500/20',
};

/**
 * Animation styles for components
 */
export const animationStyles = {
  hover: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
  active: 'transition-all duration-100 active:shadow-inner active:translate-y-0.5',
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom duration-300',
};
