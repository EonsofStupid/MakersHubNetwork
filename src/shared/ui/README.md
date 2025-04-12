
# UI Components

## Toast Components

We maintain two different toast implementations for different use cases:

### SonnerToaster
Located in `sonner.tsx`

- **Purpose**: Modern, interactive toasts with rich features
- **Use Cases**:
  - User actions feedback (save, delete, update)
  - Interactive notifications that may require user action
  - Notifications with custom styling or animations
- **Features**:
  - Theme-aware styling
  - Custom animations
  - Interactive elements
  - Rich formatting options

Example:
```tsx
import { toast } from "sonner"

// Basic usage
toast("Item saved successfully")

// With options
toast.success("Profile updated", {
  description: "Your changes have been saved",
  action: {
    label: "View",
    onClick: () => console.log("Clicked")
  }
})
```

### SystemToaster
Located in `toaster.tsx`

- **Purpose**: System-level notifications and simple alerts
- **Use Cases**:
  - System status updates
  - Non-interactive notifications
  - Simple success/error messages
- **Features**:
  - Clean, minimal design
  - Framer Motion animations
  - Consistent system styling
  - Accessibility-focused

Example:
```tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

// Basic usage
toast({
  title: "System Update",
  description: "The system has been updated"
})
```

## Best Practices

1. **Choose the Right Toast**:
   - Use `SonnerToaster` for rich, interactive notifications
   - Use `SystemToaster` for simple system messages

2. **Consistency**:
   - Stick to one type of toast per feature area
   - Use consistent messaging patterns

3. **Duration**:
   - Short duration (2-3s) for simple success messages
   - Longer duration (4-5s) for messages with more content
   - Infinite duration for critical errors or required actions 
