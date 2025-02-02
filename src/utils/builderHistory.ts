type HistoryState = {
  content: any;
  timestamp: number;
};

class BuilderHistory {
  private states: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxStates: number = 50;

  push(state: any) {
    // Remove any future states if we're not at the end
    this.states = this.states.slice(0, this.currentIndex + 1);
    
    // Add new state
    this.states.push({
      content: JSON.parse(JSON.stringify(state)), // Deep clone
      timestamp: Date.now()
    });
    
    // Maintain max states limit
    if (this.states.length > this.maxStates) {
      this.states.shift();
    }
    
    this.currentIndex = this.states.length - 1;
  }

  undo(): any | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.states[this.currentIndex].content;
    }
    return null;
  }

  redo(): any | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.states[this.currentIndex].content;
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.states.length - 1;
  }
}

export const builderHistory = new BuilderHistory();