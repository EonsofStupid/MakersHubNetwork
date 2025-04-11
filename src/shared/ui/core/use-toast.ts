
import { Toast, ToastActionElement, ToastProps } from "./toast";

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
  const toast = (props: Omit<ToasterToast, "id">) => {
    return addToast(props);
  };

  toast.dismiss = (id: string) => removeToast(id);
  toast.update = updateToast;

  return {
    toast,
    dismiss: (id: string) => removeToast(id),
    update: updateToast,
  };
}

export { useToast, toast };
