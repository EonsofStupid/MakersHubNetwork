import { ImportConfig, ImportValidationResult } from './types';

export const validateImportedAsset = (
  data: any, 
  config: ImportConfig
): ImportValidationResult => {
  try {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Invalid import data structure']
      };
    }

    // Type-specific validation
    if (!config.validator(data)) {
      return {
        isValid: false,
        errors: ['Failed type-specific validation']
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message]
    };
  }
};

export const importConfigs: Record<string, ImportConfig> = {
  page: {
    type: 'page',
    schema: {
      // Define page schema
      type: 'object',
      required: ['name', 'content'],
      properties: {
        name: { type: 'string' },
        content: { type: 'object' }
      }
    },
    validator: (data) => {
      return data.name && data.content;
    }
  },
  theme: {
    type: 'theme',
    schema: {
      // Define theme schema
      type: 'object',
      required: ['name', 'styles'],
      properties: {
        name: { type: 'string' },
        styles: { type: 'object' }
      }
    },
    validator: (data) => {
      return data.name && data.styles;
    }
  },
  template: {
    type: 'template',
    schema: {
      // Define template schema
      type: 'object',
      required: ['name', 'layout'],
      properties: {
        name: { type: 'string' },
        layout: { type: 'object' }
      }
    },
    validator: (data) => {
      return data.name && data.layout;
    }
  }
};