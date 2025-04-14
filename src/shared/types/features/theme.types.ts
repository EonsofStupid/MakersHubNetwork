
// Only updating the MorphEffect interface
export interface MorphEffect extends Omit<ThemeEffect, 'intensity'> {
  type: ThemeEffectType.MORPH;
  intensity: number; // Make it required, not optional
}
