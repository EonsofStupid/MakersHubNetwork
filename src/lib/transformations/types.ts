export interface TransformationRule {
  id: string;
  name: string;
  description?: string;
  type: 'map' | 'filter' | 'reduce' | 'custom';
  config: Record<string, any>;
}

export interface TransformationContext {
  sourceData: any[];
  targetSchema: Record<string, any>;
  rules: TransformationRule[];
}