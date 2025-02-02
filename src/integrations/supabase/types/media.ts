import { Database } from './database';

export type MediaItem = Database['public']['Tables']['media']['Row'];

export interface MediaMetadata {
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  thumbnail?: string;
}

export interface MediaUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  dimensions?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
}