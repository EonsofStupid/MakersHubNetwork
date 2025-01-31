import { useState, useEffect } from "react";
import { throttle } from "lodash";

type Platform = "mobile" | "desktop";
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export interface ResponsiveLayout {
  platform: Platform;
  currentBreakpoint: Breakpoint;
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
    platform: "desktop",
    currentBreakpoint: "md",
    containerClass: "w-full md:w-auto",
  });

  useEffect(() => {
    const calculateLayout = throttle(() => {
      const width = window.innerWidth;
      let currentBreakpoint: Breakpoint = "xs";
      let platform: Platform = width < breakpoints.md ? "mobile" : "desktop";
      
      if (width >= breakpoints["2xl"]) currentBreakpoint = "2xl";
      else if (width >= breakpoints.xl) currentBreakpoint = "xl";
      else if (width >= breakpoints.lg) currentBreakpoint = "lg";
      else if (width >= breakpoints.md) currentBreakpoint = "md";
      else if (width >= breakpoints.sm) currentBreakpoint = "sm";

      const containerClass = `
        w-[95vw] 
        ${currentBreakpoint === "xs" ? "h-[95vh]" : "h-auto"}
        ${currentBreakpoint === "sm" ? "max-w-[540px]" : ""}
        ${currentBreakpoint === "md" ? "max-w-[720px]" : ""}
        ${currentBreakpoint === "lg" ? "max-w-[960px]" : ""}
        ${currentBreakpoint === "xl" ? "max-w-[1140px]" : ""}
        ${currentBreakpoint === "2xl" ? "max-w-[1320px]" : ""}
      `.trim();

      setLayout({
        platform,
        currentBreakpoint,
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