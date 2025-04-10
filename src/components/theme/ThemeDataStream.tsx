import React from 'react';
import { useSiteTheme } from '@/app/components/theme/SiteThemeProvider';

interface ThemeDataStreamProps {
  children?: React.ReactNode;
  propertyPath?: string;
  fallback?: React.ReactNode;
}

/**
 * ThemeDataStream component
 * 
 * This component allows accessing theme data from the SiteThemeProvider
 * and renders it or passes it to children
 */
export const ThemeDataStream: React.FC<ThemeDataStreamProps> = ({ 
  children, 
  propertyPath, 
  fallback 
}) => {
  const { componentStyles, variables, animations, isLoaded } = useSiteTheme();
  
  if (!isLoaded) {
    return fallback ? <>{fallback}</> : null;
  }
  
  // If no property path is provided, provide all theme data
  if (!propertyPath) {
    const themeData = {
      componentStyles,
      variables,
      animations
    };
    
    // If children is a function, call it with theme data
    if (typeof children === 'function') {
      return children(themeData);
    }
    
    // Otherwise just render children
    return <>{children}</>;
  }
  
  // Get data from specified path
  const parts = propertyPath.split('.');
  const dataType = parts[0];
  
  let value: any = null;
  
  if (dataType === 'component' && componentStyles) {
    value = parts.slice(1).reduce((obj, key) => obj?.[key], componentStyles);
  } else if (dataType === 'variable' && variables) {
    value = variables[parts[1]];
  } else if (dataType === 'animation' && animations) {
    value = parts.slice(1).reduce((obj, key) => obj?.[key], animations);
  }
  
  // If children is a function, call it with the value
  if (typeof children === 'function') {
    return children(value);
  }
  
  // Otherwise render the value if it's renderable
  if (typeof value === 'string' || typeof value === 'number') {
    return <>{value}</>;
  }
  
  // Return fallback if value isn't renderable
  return fallback ? <>{fallback}</> : null;
};

export default ThemeDataStream;
