
export interface LayoutComponent {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: LayoutComponent[];
  content?: string;
  condition?: {
    type: string;
    value: any;
  };
  styles?: Record<string, any>;
  className?: string;
}

export interface Layout {
  id: string;
  name: string;
  type: string;
  description?: string;
  components: LayoutComponent[];
  version: number;
  scope: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  is_locked: boolean;
}
