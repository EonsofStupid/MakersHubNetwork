
# Component Migration Plan

This document outlines the migration plan for moving components from `src/components` to their proper boundaries.

## Migration Goals

1. Move UI components to `src/ui`
2. Move theme components to `src/ui/theme`
3. Move profile components to `src/profile/components`
4. Move auth components to `src/auth/components`
5. Move admin components to `src/admin/components`
6. Ensure all boundaries are properly isolated
7. Remove the original `src/components` directory

## Component Mapping

| Original Path | New Path |
|---------------|----------|
| `src/components/ui/*` | `src/ui/core/*` |
| `src/components/theme/*` | `src/ui/theme/*` |
| `src/components/profile/*` | `src/profile/components/*` |
| `src/components/auth/*` | `src/auth/components/*` |
| `src/components/admin/*` | `src/admin/components/*` |
| `src/components/ErrorBoundary.tsx` | `src/ui/layout/error-boundary.tsx` |
| `src/components/data-table.tsx` | `src/ui/data/data-table.tsx` |

## Progress Checklist

- [x] Fix build errors in src/shared/utils/render.ts
- [x] Fix build errors in src/auto-imports.d.ts
- [x] Create src/ui directory structure
- [x] Migrate core UI components
- [x] Migrate theme components
- [ ] Migrate profile components
- [ ] Migrate auth components
- [ ] Migrate admin components
- [ ] Update imports project-wide
- [ ] Test thoroughly
- [ ] Remove src/components directory

## How to Test

1. Check build output for errors
2. Verify all components render properly
3. Test key user flows to ensure functionality is preserved
4. Run component migration script to verify no components remain unmigrated

## Cleanup

After confirming all components have been properly migrated and the application works correctly:

```bash
rm -rf src/components
```

