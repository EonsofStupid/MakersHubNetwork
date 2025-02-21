
import { create } from 'zustand';
import { BuildSubmission } from '../types/content.types';

interface BuildState {
  builds: BuildSubmission[];
  selectedBuild: string | null;
  setBuilds: (builds: BuildSubmission[]) => void;
  setSelectedBuild: (id: string | null) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  builds: [],
  selectedBuild: null,
  setBuilds: (builds) => set({ builds }),
  setSelectedBuild: (id) => set({ selectedBuild: id }),
}));
