export interface BuilderElement {
  id: string;
  type: 'heading' | 'text' | 'image' | 'button';
  content: {
    text?: string;
    url?: string;
    alt?: string;
    [key: string]: any;
  };
}

export interface BuilderState {
  elements: BuilderElement[];
  selectedElement: string | null;
}

export interface BuilderAction {
  type: 'ADD_ELEMENT' | 'UPDATE_ELEMENT' | 'DELETE_ELEMENT' | 'SELECT_ELEMENT';
  payload: any;
}