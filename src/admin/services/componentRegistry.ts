
/**
 * Component Registry Service
 * Manages the registration and retrieval of components for the layout engine
 */
class ComponentRegistry {
  private components: Record<string, React.ComponentType<any> | keyof JSX.IntrinsicElements> = {};
  
  /**
   * Register a component with the registry
   */
  registerComponent(type: string, component: React.ComponentType<any> | keyof JSX.IntrinsicElements) {
    this.components[type] = component;
  }
  
  /**
   * Get a component from the registry by type
   */
  getComponent(type: string): React.ComponentType<any> | keyof JSX.IntrinsicElements | null {
    return this.components[type] || null;
  }
  
  /**
   * Check if a component type is registered
   */
  hasComponent(type: string): boolean {
    return !!this.components[type];
  }
  
  /**
   * Get all registered component types
   */
  getRegisteredComponents(): string[] {
    return Object.keys(this.components);
  }
  
  /**
   * Clear all registered components
   */
  clear() {
    this.components = {};
  }
}

// Create a singleton instance
const componentRegistry = new ComponentRegistry();

export default componentRegistry;
