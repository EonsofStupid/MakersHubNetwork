
import React from 'react';
import { ComponentRegistration } from '@/admin/types/layout.types';

/**
 * Registry for mapping component identifiers to React components
 */
class ComponentRegistry {
  private registry: Record<string, ComponentRegistration> = {};
  private fallbackComponent: React.ComponentType<any> | null = null;

  /**
   * Register a component with the registry
   */
  register(id: string, registration: ComponentRegistration): void {
    this.registry[id] = registration;
  }

  /**
   * Register multiple components at once
   */
  registerBulk(components: Record<string, ComponentRegistration>): void {
    this.registry = { ...this.registry, ...components };
  }

  /**
   * Get a component by ID
   */
  getComponent(id: string): React.ComponentType<any> | null {
    if (this.registry[id]) {
      return this.registry[id].component;
    }
    return this.fallbackComponent;
  }

  /**
   * Get component registration by ID
   */
  getRegistration(id: string): ComponentRegistration | null {
    return this.registry[id] || null;
  }

  /**
   * Set a fallback component to use when a component is not found
   */
  setFallbackComponent(component: React.ComponentType<any>): void {
    this.fallbackComponent = component;
  }

  /**
   * Clear the registry
   */
  clear(): void {
    this.registry = {};
  }

  /**
   * Get all registered components
   */
  getAll(): Record<string, ComponentRegistration> {
    return { ...this.registry };
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();

// Default export for easier imports
export default componentRegistry;
