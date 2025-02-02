import BuildTemplate from '../BuildTemplate';
import GuideTemplate from '../GuideTemplate';
import PartTemplate from '../PartTemplate';
import { TemplateType, TemplateConfig } from '../types/template';
import { Layout, Book, Wrench } from 'lucide-react';

export const templateRegistry: Record<TemplateType, TemplateConfig> = {
  build: {
    name: 'Build Template',
    description: 'Template for creating build documentation',
    icon: Layout,
    component: BuildTemplate,
    defaultProps: {
      sections: [],
      metadata: {}
    },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        sections: { type: 'array' }
      }
    }
  },
  guide: {
    name: 'Guide Template',
    description: 'Template for creating step-by-step guides',
    icon: Book,
    component: GuideTemplate,
    defaultProps: {
      steps: [],
      difficulty: 'beginner'
    },
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        steps: { type: 'array' },
        difficulty: { 
          type: 'string',
          enum: ['beginner', 'intermediate', 'advanced']
        }
      }
    }
  },
  part: {
    name: 'Part Template',
    description: 'Template for creating part documentation',
    icon: Wrench,
    component: PartTemplate,
    defaultProps: {
      specifications: {},
      compatibility: []
    },
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        specifications: { type: 'object' },
        compatibility: { type: 'array' }
      }
    }
  }
};

export const useTemplate = (type: TemplateType) => {
  const template = templateRegistry[type];
  
  if (!template) {
    throw new Error(`Template type "${type}" not found in registry`);
  }
  
  return template;
};

export const getAvailableTemplates = () => {
  return Object.entries(templateRegistry).map(([type, config]) => ({
    type: type as TemplateType,
    ...config
  }));
};

// Re-export TemplateType to fix the export error
export type { TemplateType };