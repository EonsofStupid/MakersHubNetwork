
import { ReactNode } from 'react';

/**
 * Feature Types
 */
export type FeatureType = 'database' | 'forum' | 'chat';

export interface FeatureItemProps {
  type: FeatureType;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

/**
 * Build Types
 */
export interface BuildItem {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
  category: string;
  likes: number;
  views: number;
}

export interface BuildItemProps {
  build: BuildItem;
}

/**
 * Hero Section Types
 */
export interface HeroButtonProps {
  id: string;
  label: string;
  href: string;
  primary?: boolean;
  secondary?: boolean;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
}

export interface HeroProps {
  title: ReactNode;
  subtitle: ReactNode;
  description: string;
  ctaButtons: HeroButtonProps[];
}
