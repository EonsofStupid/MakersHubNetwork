# Type Definitions

## User-Related Types

We maintain separate type definitions for authentication and user activity to keep concerns separated and maintain clear boundaries.

### Authentication Types
Located in `auth.types.ts`

- **Purpose**: Define types related to user authentication and authorization
- **Key Types**:
  - `UserRole`: Base role type from database
  - `AuthUser`: Core user type with authentication properties
  - `AdminAccess`: Admin-specific access control
  - `WithAdminAccess`: Interface for components requiring admin access

Example:
```tsx
import type { AuthUser, UserRole } from "@/types/auth.types"

function AdminComponent({ user }: { user: AuthUser }) {
  const isAdmin = user.user_roles.some(r => r.role === "admin")
  // ...
}
```

### User Activity Types
Located in `user-activity.ts`

- **Purpose**: Define types for tracking and managing user activity
- **Key Types**:
  - `UserActivityProfile`: Extended user profile with activity data
  - `UseUserActivityOptions`: Options for activity tracking
  - `UserActivityStats`: Statistical data about user activity
  - `ProfileWithRoles`: Database-level user profile with roles

Example:
```tsx
import type { UserActivityProfile } from "@/types/user-activity"

function ActivityDashboard({ profile }: { profile: UserActivityProfile }) {
  const isActive = profile.is_active && !profile.admin_override_active
  // ...
}
```

## Best Practices

1. **Type Selection**:
   - Use `AuthUser` for authentication and authorization checks
   - Use `UserActivityProfile` for activity-related features
   - Reference `UserRole` from auth.types.ts for role checks

2. **Type Extensions**:
   - Extend `AuthUser` for auth-specific features
   - Extend `UserActivityProfile` for activity-specific features
   - Avoid mixing concerns between auth and activity

3. **Database Types**:
   - Use `ProfileWithRoles` when working directly with database responses
   - Convert to appropriate interface (AuthUser/UserActivityProfile) in data layer
   - Keep database-specific types isolated from UI components 