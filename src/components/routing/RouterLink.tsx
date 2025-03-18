
import React from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RouterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  asChild?: boolean;
  className?: string;
}

export const RouterLink: React.FC<RouterLinkProps> = ({ 
  to, 
  children, 
  className,
  onClick,
  ...props
}) => {
  return (
    <ReactRouterLink
      to={to}
      className={className}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    >
      {children}
    </ReactRouterLink>
  );
};

// Button variant
export const RouterLinkButton: React.FC<RouterLinkProps & { variant?: 'button' | 'ghost' | 'link' }> = ({
  to,
  children,
  className,
  variant = 'button',
  ...props
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(to);
    
    // Call the original onClick if provided
    if (props.onClick) {
      props.onClick(e as any);
    }
  };
  
  const baseClasses = "inline-flex items-center justify-center";
  const variantClasses = {
    button: "px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary-foreground transition-colors",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md px-3 py-2 transition-colors",
    link: "text-primary hover:underline"
  };
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
