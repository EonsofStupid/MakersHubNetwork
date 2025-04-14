
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cn } from "@/lib/utils"

// Define our own toggleVariants for simplicity
const toggleVariants = {
  variant: {
    default: "bg-background hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
  },
  size: {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5"
  }
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    variant?: "default" | "outline",
    size?: "default" | "sm" | "lg" 
  }
>(({ className, children, variant = "default", size = "default", ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      toggleVariants.variant[variant],
      toggleVariants.size[size],
      className
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
