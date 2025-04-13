
import React from 'react';

interface ComponentRegistryOptions {
  defaultProps?: Record<string, any>;
}

class ComponentRegistry {
  private registry: Record<string, React.ComponentType<any> | string> = {};
  private options: Record<string, ComponentRegistryOptions> = {};

  registerComponent(
    name: string,
    component: React.ComponentType<any> | string,
    options: ComponentRegistryOptions = {}
  ) {
    this.registry[name] = component;
    this.options[name] = options;
  }

  getComponent(name: string): React.ComponentType<any> | null {
    const component = this.registry[name];
    if (!component) return null;
    return component as React.ComponentType<any>;
  }

  getDefaultProps(name: string): Record<string, any> {
    return this.options[name]?.defaultProps || {};
  }

  getRegisteredComponents(): string[] {
    return Object.keys(this.registry);
  }
}

// Create singleton instance
const componentRegistry = new ComponentRegistry();
export default componentRegistry;
