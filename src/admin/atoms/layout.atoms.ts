
import { atom } from 'jotai';
import { Layout, LayoutSkeleton } from '@/admin/types/layout.types';

// Available layouts in the system
export const availableLayoutsAtom = atom<LayoutSkeleton[]>([]);

// Cache of loaded layouts to minimize database queries
export const layoutCacheAtom = atom<Record<string, Layout>>({});

// Layout loading state
export const layoutLoadingAtom = atom<boolean>(false);
