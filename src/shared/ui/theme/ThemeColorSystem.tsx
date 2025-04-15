
import React from 'react';
import { useThemeVariables } from '@/hooks/useThemeVariables';
import { Theme } from '@/shared/types/theme.types';

interface ThemeColorBlockProps {
  color: string;
  name: string;
  value: string;
}

const ThemeColorBlock = ({ color, name, value }: ThemeColorBlockProps) => (
  <div className="flex flex-col">
    <div className="h-12 w-full rounded-md border" style={{ backgroundColor: value }} />
    <div className="mt-1">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">{value}</p>
    </div>
  </div>
);

interface ThemeColorSystemProps {
  theme?: Theme | null;
  className?: string;
}

export const ThemeColorSystem: React.FC<ThemeColorSystemProps> = ({
  theme,
  className = '',
}) => {
  const { variables } = useThemeVariables();

  if (!theme && !variables) return null;

  const colors = {
    primary: variables.primary || '#000',
    secondary: variables.secondary || '#000',
    accent: variables.accent || '#000',
    background: variables.background || '#000',
    foreground: variables.foreground || '#fff',
    muted: variables.muted || '#000',
    mutedForeground: variables.mutedForeground || '#000',
    card: variables.card || '#000',
    cardForeground: variables.cardForeground || '#000',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Color System</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <ThemeColorBlock color="primary" name="Primary" value={colors.primary} />
        <ThemeColorBlock color="secondary" name="Secondary" value={colors.secondary} />
        <ThemeColorBlock color="accent" name="Accent" value={colors.accent} />
        <ThemeColorBlock color="background" name="Background" value={colors.background} />
        <ThemeColorBlock color="foreground" name="Foreground" value={colors.foreground} />
        <ThemeColorBlock color="muted" name="Muted" value={colors.muted} />
        <ThemeColorBlock color="mutedForeground" name="Muted Foreground" value={colors.mutedForeground} />
        <ThemeColorBlock color="card" name="Card" value={colors.card} />
      </div>
    </div>
  );
};

export default ThemeColorSystem;
