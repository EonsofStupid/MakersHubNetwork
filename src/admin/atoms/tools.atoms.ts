
import { atom } from 'jotai';
import { FrozenZone, AdminOverlayConfig } from '../types/admin.types';

// Admin tools state
export const frozenZonesAtom = atom<FrozenZone[]>([]);
export const overlayConfigsAtom = atom<AdminOverlayConfig[]>([]);

// AI assistant state
export const aiAssistantVisibleAtom = atom<boolean>(false);
export const aiAssistantPromptAtom = atom<string>('');
export const aiAssistantResponseAtom = atom<string | null>(null);

// Effects palette state
export const effectsPaletteVisibleAtom = atom<boolean>(false);
export const selectedEffectAtom = atom<string | null>(null);

// Screen recorder state
export const isRecordingAtom = atom<boolean>(false);
export const recordingStepsAtom = atom<any[]>([]);
