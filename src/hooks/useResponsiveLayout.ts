import { useState, useEffect } from "react";
import { throttle } from "lodash";

export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export interface ResponsiveLayout {
  currentBreakpoint: keyof BreakpointConfig;
  isCompact: boolean;
  containerClass: string;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const useResponsiveLayout = (
  customBreakpoints?: Partial<BreakpointConfig>
): ResponsiveLayout => {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  const [layout, setLayout] = useState<ResponsiveLayout>({
    currentBreakpoint: "md",
    isCompact: false,
    containerClass: "w-full md:w-auto",
  });

  useEffect(() => {
    const calculateLayout = throttle(() => {
      const width = window.innerWidth;
      let currentBreakpoint: keyof BreakpointConfig = "xs";
      
      // Determine current breakpoint
      Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a)
        .some(([key, value]) => {
          if (width >= value) {
            currentBreakpoint = key as keyof BreakpointConfig;
            return true;
          }
          return false;
        });

      // Generate container class based on breakpoint
      const containerClass = `
        w-[95vw] 
        ${currentBreakpoint === ("xs" as keyof BreakpointConfig) ? "h-[95vh]" : "h-auto"}
        ${currentBreakpoint === ("sm" as keyof BreakpointConfig) ? "max-w-[540px]" : ""}
        ${currentBreakpoint === ("md" as keyof BreakpointConfig) ? "max-w-[720px]" : ""}
        ${currentBreakpoint === ("lg" as keyof BreakpointConfig) ? "max-w-[960px]" : ""}
        ${currentBreakpoint === ("xl" as keyof BreakpointConfig) ? "max-w-[1140px]" : ""}
        ${currentBreakpoint === ("2xl" as keyof BreakpointConfig) ? "max-w-[1320px]" : ""}
      `.trim();

      setLayout({
        currentBreakpoint,
        isCompact: width < breakpoints.md,
        containerClass,
      });
    }, 100);

    calculateLayout();
    window.addEventListener("resize", calculateLayout);

    return () => {
      window.removeEventListener("resize", calculateLayout);
      calculateLayout.cancel();
    };
  }, [breakpoints]);

  return layout;
};