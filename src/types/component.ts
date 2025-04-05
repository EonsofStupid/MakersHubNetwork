
import { ThemeContext } from './theme';

export interface ThemeComponent {
  id: string;
  type: string;
  name: string;
  description?: string;
  props?: Record<string, any>;
  styles?: Record<string, any>;
  variants?: Record<string, any>;
  states?: Record<string, any>;
  context?: ThemeContext;
}
