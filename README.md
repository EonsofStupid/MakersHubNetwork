
# Project Architecture

This project follows a clean architecture approach with domain-driven design principles.

## Folder Structure

```
src/
├── admin/             # Admin panel features
│   ├── atoms/         # Jotai atoms for component state
│   ├── components/    # Admin UI components  
│   ├── hooks/         # Admin-specific hooks
│   ├── store/         # Zustand stores (global state)
│   └── types/         # Admin domain types
├── app/               # Main application
│   ├── components/    # App-specific components
│   ├── hooks/         # App-specific hooks  
│   └── layout/        # Application layouts
├── auth/              # Authentication domain
│   ├── components/    # Auth-specific components
│   ├── hooks/         # Auth-related hooks
│   └── store/         # Auth state management
├── shared/            # Shared utilities and components
│   ├── types/         # Global type definitions
│   └── ui/            # Reusable UI components
└── bridges/           # Communication bridges between domains
```

## State Management

The application follows a strict state management strategy:

- **Zustand**: Used for global, app-wide state
- **Jotai**: Used for component-level state and derived state
- **Context**: Used for component trees that need shared state

## Type System

All types are explicitly defined and exported:

- Enums for discrete values
- Literal types for fixed values
- Interfaces for complex objects

## Module Boundaries

Each domain is isolated with clear boundaries:
- Communication happens through defined bridges
- No direct imports between domains except through bridges
- State is owned by a single domain

## UI Components

UI components follow these principles:
- Small, focused components
- Clear prop interfaces
- Responsive by default
- Accessible
- Theme-aware
