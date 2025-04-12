import { ReactNode } from 'react';

export type ThemeEffect = {
  id: string;  // Add id property
  type: 'none' | 'blur' | 'grain' | 'noise' | 'glow';
  enabled: boolean;
  [key: string]: any;
};

// Rest of the file remains the same 