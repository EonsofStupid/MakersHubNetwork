
# Project Structure Documentation

This project follows a modular architecture with clear boundaries between different parts of the application.

## Directory Structure

```
/src
  /app               # Primary app UI logic and routing (e.g., /profile lives here)
  /admin             # Admin-only overlays, configs, and routes
  /chat              # Registry-based isolated chat system
  /bridges           # AuthBridge, ChatBridge, LogBridge, AppBridge
  /shared
    /types           # String literal types, enums, interfaces
    /utils           # Composable shared logic
    /ui              # Truly shared components (Button, Dialog, etc)
```

## Module Boundaries

### App Module (`/src/app`)
- Contains the main application UI logic and routing
- Profile management lives here
- Should import from shared modules but not from admin or chat

### Admin Module (`/src/admin`)
- Contains admin-only overlays, configurations, and routes
- Fully isolated from the main app
- Should only access app functionality through bridges

### Chat Module (`/src/chat`)
- Registry-based, plugin-isolated chat system
- Should not reach into shared app code directly
- Uses bridges for communication with other modules

### Bridges (`/src/bridges`)
- Used for cross-module communication
- Examples: AuthBridge, ChatBridge, LogBridge, AppBridge
- Provides clear API boundaries between modules

### Shared (`/src/shared`)
- Contains code shared across modules

#### Types (`/src/shared/types`)
- String literal types, enums, interfaces
- Used across all modules

#### Utils (`/src/shared/utils`)
- Utility functions and composable logic
- Used across all modules

#### UI (`/src/shared/ui`)
- Truly shared UI components like buttons, dialogs, etc.
- Used across all modules
- Organized into subdirectories:
  - `/core` - Basic UI elements (buttons, inputs, etc.)
  - `/data` - Data display components (tables, lists, etc.)
  - `/feedback` - Feedback components (notifications, loaders, etc.)
  - `/layout` - Layout components (containers, grids, etc.)

## Import Guidelines

- Always import from the most specific module possible
- Avoid circular dependencies between modules
- Use bridges for cross-module communication
- Import shared modules as needed

## Example Imports

```typescript
// Correct imports
import { Button } from '@/shared/ui/core/button';
import { User } from '@/shared/types';
import { authBridge } from '@/bridges/AuthBridge';

// Incorrect imports - avoid these patterns
import { AdminPanel } from '@/admin/components'; // Don't import admin components in app code
import { ChatWindow } from '@/chat/components'; // Don't import chat components in app code
```
