
# Component Migration Status

## Completed Migrations
- Basic folder structure for all domains
- Shared types in shared/types
- UI components in shared/ui
- Toast system in shared/hooks
- AppBootstrap and AppInitializer to app/components
- MainNav to app/components/MainNav
- ProfileDialog and ProfileEditor to app/components/profile
- KeyboardNavigation to shared/components
- Theme types to shared/types/theme.types.ts
- CircuitBreaker utility updated

## Next Steps
1. Move all remaining UI components to shared/ui:
   - Buttons, inputs, dialogs, etc.
   
2. Move auth-related components to auth/components:
   - UserMenu, LoginSheet, etc.
   
3. Move landing page components to app/components/landing:
   - FeaturesSection, BuildShowcase, etc.
   
4. Move theme-related components to shared/theme:
   - ThemeProvider, ThemeInitializer, etc.
   
5. Move admin components to admin/components:
   - AdminLayout, AdminSidebar, etc.
   
6. Fix remaining import paths throughout the codebase
   
7. Delete the src/components directory once all components have been migrated

## Build Errors to Fix
- LogCategory and LogLevel type exports
- Missing exports from auth.store
- Navigation config and AdminSidebar component
- AuthBridge implementation
- Update imports across the codebase
