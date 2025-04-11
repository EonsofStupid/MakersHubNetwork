
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import React from "react";

// Define a component to render the icon dynamically
const DynamicIcon = ({ name }: { name: string }) => {
  // @ts-ignore - dynamically accessing icons
  const Icon = LucideIcons[name.split('-').map(
    part => part.charAt(0).toUpperCase() + part.slice(1)
  ).join('')] || LucideIcons.Info;

  return <Icon className="h-4 w-4" />;
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, icon, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2">
              {icon && typeof icon === 'string' && (
                <DynamicIcon name={icon} />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
