
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--impulse-primary)]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--impulse-primary)]/10 text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-primary)]/20 border border-[var(--impulse-primary)]/30",
        destructive: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30",
        outline: "border border-[var(--impulse-border-normal)] bg-transparent hover:bg-[var(--impulse-bg-hover)] hover:border-[var(--impulse-border-hover)]",
        secondary: "bg-[var(--impulse-bg-card)] text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)] border border-[var(--impulse-border-normal)]",
        ghost: "bg-transparent hover:bg-[var(--impulse-bg-hover)] text-[var(--impulse-text-primary)]",
        link: "text-[var(--impulse-primary)] underline-offset-4 hover:underline bg-transparent",
        cyber: "bg-[var(--impulse-primary)]/10 text-[var(--impulse-primary)] hover:bg-[var(--impulse-primary)]/20 border border-[var(--impulse-primary)]/30 electric-border",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xs: "h-6 px-2 text-xs rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
