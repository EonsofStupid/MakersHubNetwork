
import { Permission } from './permissions/constants';

/**
 * Reexport of Permission type for project-wide usage
 */
export type { Permission };

// For backward compatibility
export const PROJECT_PERMISSIONS = {
  VIEW: 'project:view',
  CREATE: 'project:create',
  EDIT: 'project:edit',
  DELETE: 'project:delete',
  SUBMIT: 'project:submit'
} as const;

export type ProjectPermission = typeof PROJECT_PERMISSIONS[keyof typeof PROJECT_PERMISSIONS];

