
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useThemeStore } from "@/stores/theme/store"; 

export const Logo = () => {
  const variables = useThemeStore(state => state.variables);

  // Default logo styling if no theme tokens are available
  const defaultLogoStyles = {
    container: "flex items-center gap-2",
    text: "text-lg font-bold tracking-tight hover:text-primary transition-colors duration-300",
    highlight: "text-primary",
    pulse: "animate-pulse"
  };

  // Use theme tokens if available, fallback to defaults
  const styles = {
    container: variables?.['logo-container'] || defaultLogoStyles.container,
    text: variables?.['logo-text'] || defaultLogoStyles.text,
    highlight: variables?.['logo-highlight'] || defaultLogoStyles.highlight,
    pulse: variables?.['logo-pulse'] || defaultLogoStyles.pulse
  };

  // If we have a custom logo in the theme, use it
  const logoSrc = variables?.['logo-src'];

  return (
    <Link to="/" className={cn(styles.container, "logo")}>
      {logoSrc ? (
        <img src={logoSrc} alt="Logo" className="h-8 w-8" />
      ) : (
        <div className="text-lg font-bold tracking-tight">
          <span className={styles.text}>Impulse</span>
          <span className={cn(styles.text, styles.highlight)}>UI</span>
        </div>
      )}
    </Link>
  );
};
