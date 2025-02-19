
import { create } from 'zustand';
import { CategoryData } from '../types/content.types';

interface CategoryState {
  categories: CategoryData[];
  selectedCategory: string | null;
  setCategories: (categories: CategoryData[]) => void;
  setSelectedCategory: (id: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  selectedCategory: null,
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (id) => set({ selectedCategory: id }),
}));
