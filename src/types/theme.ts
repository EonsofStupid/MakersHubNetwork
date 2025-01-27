import { Theme, DesignTokens, ComponentToken } from "@/schemas/theme.schema";

export type { Theme, DesignTokens as DesignTokensStructure, ComponentToken as ComponentTokens };

export type ThemeStatus = 'draft' | 'published' | 'archived';

export type ThemeComponent = ComponentToken;