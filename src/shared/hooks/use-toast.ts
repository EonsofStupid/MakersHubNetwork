
import * as React from "react";
import { Toast, ToastActionElement, ToastProps } from "@/shared/ui/core/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 10;
const TOAST_REMOVE_DELAY = 1000000;

let listeners: ((data: ToasterToast[]) => void)[] = [];
let toasts: ToasterToast[] = [];

function dispatch() {
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

function addToast({
  title,
  description,
  variant,
  action,
  ...props
}: Omit<ToasterToast, "id">) {
  const id = String(Date.now());

  toasts = [
    {
      id,
      title,
      description,
      variant,
      action,
      ...props,
    },
    ...toasts,
  ].slice(0, TOAST_LIMIT);

  dispatch();

  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  dispatch();
}

function updateToast({
  id,
  ...props
}: Omit<ToasterToast, "id"> & { id: string }) {
  toasts = toasts.map((toast) =>
    toast.id === id ? { ...toast, ...props } : toast
  );

  dispatch();
}

function useToast() {
  const [localToasts, setLocalToasts] = React.useState<ToasterToast[]>([]);

  React.useEffect(() => {
    listeners.push(setLocalToasts);
    return () => {
      const index = listeners.indexOf(setLocalToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: localToasts,
    toast: Object.assign(
      (props: Omit<ToasterToast, "id">) => addToast(props),
      {
        dismiss: (id: string) => removeToast(id),
        update: updateToast,
      }
    ),
    dismiss: (id: string) => removeToast(id),
    update: updateToast,
  };
}

// Export the named toast function, but don't use circular export
const toast = Object.assign(
  (props: Omit<ToasterToast, "id">) => addToast(props),
  {
    dismiss: (id: string) => removeToast(id),
    update: updateToast,
  }
);

export { useToast, toast, type ToasterToast };
