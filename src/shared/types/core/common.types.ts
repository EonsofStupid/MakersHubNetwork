
/**
 * Common utility types used across the application
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type WithId = { id: string };

export type BaseEntity = {
  id: string;
  created_at: string;
  updated_at: string;
};
