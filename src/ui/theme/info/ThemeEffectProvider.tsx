
import { ReactNode } from "react";

interface ThemeEffectProviderProps {
  children: ReactNode;
}

export function ThemeEffectProvider({ children }: ThemeEffectProviderProps) {
  return <div className="relative overflow-hidden">{children}</div>;
}
