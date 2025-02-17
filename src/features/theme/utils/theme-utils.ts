import { Theme, ComponentTokens, ThemeToken } from '../types';

export const getThemeToken = (
  theme: Theme | null,
  tokenName: string,
  context: string = 'app'
): string | null => {
  if (!theme) return null;
  return theme.design_tokens[tokenName] || null;
};

export const getComponentStyles = (
  theme: Theme | null,
  componentName: string,
  context: string = 'app'
): Record<string, any> | null => {
  if (!theme) return null;
  
  const componentToken = theme.component_tokens.find(
    token => token.component_name === componentName && token.context === context
  );
  
  return componentToken?.styles || null;
};

export const applyCompositionRules = (
  theme: Theme | null,
  componentStyles: Record<string, any>,
  context: string = 'app'
): Record<string, any> => {
  if (!theme || !componentStyles) return {};

  const rules = theme.composition_rules[context] || {};
  const composedStyles = { ...componentStyles };

  // Apply composition rules
  Object.entries(rules).forEach(([selector, rule]) => {
    if (componentStyles[selector]) {
      composedStyles[selector] = {
        ...componentStyles[selector],
        ...(typeof rule === 'function' ? rule(componentStyles[selector]) : rule),
      };
    }
  });

  return composedStyles;
};

export const generateThemeClass = (
  theme: Theme | null,
  componentName: string,
  context: string = 'app'
): string => {
  if (!theme) return '';
  
  const baseClass = `theme-${theme.id}`;
  const componentClass = `${baseClass}-${componentName}`;
  const contextClass = context !== 'app' ? `${componentClass}-${context}` : componentClass;
  
  return contextClass;
};

export const getCachedStyles = (
  theme: Theme | null,
  componentName: string,
  context: string = 'app'
): string | null => {
  if (!theme) return null;
  
  const cacheKey = `${componentName}-${context}`;
  return theme.cached_styles[cacheKey] || null;
};

export const validateThemeStructure = (theme: Theme): string[] => {
  const errors: string[] = [];

  // Check required fields
  if (!theme.id) errors.push('Theme ID is required');
  if (!theme.name) errors.push('Theme name is required');
  if (!theme.design_tokens) errors.push('Design tokens are required');
  if (!Array.isArray(theme.component_tokens)) errors.push('Component tokens must be an array');
  if (!theme.composition_rules) errors.push('Composition rules are required');

  // Validate component tokens
  theme.component_tokens.forEach((token, index) => {
    if (!token.id) errors.push(`Component token at index ${index} is missing an ID`);
    if (!token.component_name) errors.push(`Component token at index ${index} is missing a component name`);
    if (!token.styles || typeof token.styles !== 'object') {
      errors.push(`Component token at index ${index} has invalid styles`);
    }
  });

  return errors;
}; 