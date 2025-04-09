
# MakersImpulse Component Catalog

## Navigation Components

### MainNav
The primary navigation component for the site, featuring a cyberpunk aesthetic.

**Files**:
- `components/MainNav/index.ts`: Main export
- `components/MainNav/MainNav.tsx`: Component implementation
- `components/MainNav/styles/cyber-effects.css`: Special effects
- `components/MainNav/components/`: Sub-components

**Sub-components**:
- `AuthSection`: Handles authentication UI
- `LoginSheet`: Modal for login/registration
- `NavLinks`: Navigation links

### Footer
The site footer component.

**Files**:
- `components/Footer/Footer.tsx`: Component implementation
- `components/Footer/styles.css`: Footer-specific styles

## Authentication Components

### LoginSheet
Modal sheet for authentication, supporting login and registration.

**Files**:
- `components/MainNav/components/LoginSheet.tsx`: Implementation
- Uses `useAuth` hook for authentication logic

### AuthSection
Displays user avatar or login button based on authentication state.

**Files**:
- `components/MainNav/components/AuthSection.tsx`: Implementation
- Features admin access controls

## Theme Components

### ThemeProvider
Core theme provider from shadcn/ui.

**Files**:
- `components/ui/theme-provider.tsx`: Implementation
- Controls dark/light mode

### SiteThemeProvider
Custom theme provider for the site.

**Files**:
- `components/theme/SiteThemeProvider.tsx`: Implementation
- Provides theme variables and component styles

### ThemeInitializer
Handles theme initialization and fallbacks.

**Files**:
- `components/theme/ThemeInitializer.tsx`: Implementation

### ImpulsivityInit
Initializes the Impulsivity theme.

**Files**:
- `components/theme/ImpulsivityInit.tsx`: Implementation

## Admin Components

### Admin Theme Components
Various components for the admin theme system.

**Files**:
- `admin/theme/AdminThemeProvider.tsx`: Admin theme context
- `admin/theme/impulse/`: Impulse theme files

## UI Components

### Button
Standard button component with theme support.

**Files**:
- `components/ui/button.tsx`: Implementation

### Sheet
Modal sheet component used for dialogs.

**Files**:
- `components/ui/sheet.tsx`: Implementation

### Tabs
Tabbed interface component.

**Files**:
- `components/ui/tabs.tsx`: Implementation

### Avatar
User avatar component.

**Files**:
- `components/ui/avatar.tsx`: Implementation

### Toast
Notification component.

**Files**:
- `components/ui/toast.tsx`: Implementation
- `components/ui/toaster.tsx`: Toast container
