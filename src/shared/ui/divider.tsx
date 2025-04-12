
import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-px w-full bg-border", className)}
      {...props}
    />
  )
);

Divider.displayName = "Divider";

export { Divider };
