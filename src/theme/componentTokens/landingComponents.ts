
import { ComponentTokens } from "@/types/theme";

/**
 * Component tokens for landing page components
 * These will be synced with the database to ensure consistent styling
 */
export const landingComponentTokens: ComponentTokens[] = [
  {
    id: "feature-cta",
    component_name: "FeatureCta",
    context: "site",
    styles: {
      container: "relative p-6 bg-card/80 backdrop-blur-md rounded-lg border border-border/20 transition-all duration-300 hover:shadow-md hover:-translate-y-1",
      title: "text-xl font-semibold mb-2",
      description: "text-muted-foreground mb-4",
      cta: "text-primary hover:text-primary/80 hover:underline inline-flex items-center"
    }
  },
  {
    id: "features-section",
    component_name: "FeaturesSection",
    context: "site",
    styles: {
      container: "py-16 bg-background/30 backdrop-blur-sm relative",
      title: "text-3xl font-bold text-center mb-12",
      grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4",
    }
  },
  {
    id: "build-showcase",
    component_name: "BuildShowcase",
    context: "site",
    styles: {
      container: "py-16 bg-background/20 backdrop-blur-sm",
      heading: "text-3xl font-bold text-center mb-4",
      subheading: "text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4",
      card: "build-card overflow-hidden rounded-lg border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300",
      cardImage: "w-full h-full object-cover transition-transform duration-500",
      cardOverlay: "absolute inset-0 bg-gradient-to-t from-background to-transparent",
      cardContent: "p-4",
      cardTitle: "font-bold text-lg mb-1 line-clamp-1",
      cardCreator: "text-sm text-muted-foreground mb-2",
      cardStats: "flex items-center justify-between text-xs text-muted-foreground"
    }
  },
  {
    id: "hero-section",
    component_name: "HeroSection",
    context: "site",
    styles: {
      container: "relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden",
      content: "z-10 text-center px-4",
      title: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient",
      subtitle: "text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8",
      buttonContainer: "flex flex-wrap justify-center gap-4",
      primaryButton: "rounded-md px-5 py-2.5 text-sm font-medium shadow bg-primary text-primary-foreground hover:bg-primary/90",
      secondaryButton: "rounded-md px-5 py-2.5 text-sm font-medium bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 transition-colors",
      background: "absolute inset-0 z-0"
    }
  }
];

/**
 * Admin component tokens for consistent admin panel styling
 */
export const adminComponentTokens: ComponentTokens[] = [
  {
    id: "admin-panel",
    component_name: "AdminPanel",
    context: "admin",
    styles: {
      container: "min-h-screen bg-[var(--impulse-bg-main)]",
      content: "p-6 pt-20",
      card: "bg-[var(--impulse-bg-card)] border border-[var(--impulse-border-normal)] rounded-lg p-4",
      heading: "text-[var(--impulse-text-primary)] text-2xl font-bold mb-4",
      text: "text-[var(--impulse-text-secondary)]"
    }
  },
  {
    id: "admin-sidebar",
    component_name: "AdminSidebar",
    context: "admin",
    styles: {
      container: "fixed left-0 top-0 h-screen bg-[var(--impulse-bg-overlay)] border-r border-[var(--impulse-border-normal)] transition-all duration-300",
      expanded: "w-64",
      collapsed: "w-16",
      logo: "p-4 border-b border-[var(--impulse-border-normal)] flex items-center justify-center",
      nav: "py-4 px-2",
      navItem: "flex items-center px-3 py-2 rounded-md my-1 text-[var(--impulse-text-secondary)] hover:bg-[var(--impulse-border-hover)] hover:text-[var(--impulse-text-accent)] transition-colors",
      navItemActive: "bg-[var(--impulse-border-normal)] text-[var(--impulse-text-accent)]",
      navItemIcon: "mr-3 flex-shrink-0 w-5 h-5",
      navItemLabel: "truncate",
      footer: "absolute bottom-0 w-full border-t border-[var(--impulse-border-normal)] p-4"
    }
  },
  {
    id: "admin-topnav",
    component_name: "AdminTopNav",
    context: "admin",
    styles: {
      container: "fixed top-0 left-0 right-0 h-14 bg-[var(--impulse-bg-overlay)] border-b border-[var(--impulse-border-normal)] flex items-center justify-between px-4 z-40",
      title: "text-[var(--impulse-text-primary)] font-bold flex items-center gap-2",
      icon: "text-[var(--impulse-primary)] pulse-glow",
      actions: "flex items-center space-x-3",
      button: "p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]",
      buttonActive: "bg-[var(--impulse-border-normal)] text-[var(--impulse-primary)]"
    }
  }
];

/**
 * Get all component tokens combined for theme synchronization
 */
export function getAllComponentTokens(): ComponentTokens[] {
  return [...landingComponentTokens, ...adminComponentTokens];
}
