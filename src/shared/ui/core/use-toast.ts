
// This file contains the toast hook and functionality
import { type ToastActionElement, type ToastProps } from "./toast";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  return (++count).toString();
}

// State
type State = {
  toasts: ToasterToast[];
};

// Store for toast state
const toastState: State = {
  toasts: [],
};

// Listeners for state changes
let listeners: Array<(state: State) => void> = [];

function dispatch(action: any) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      toastState.toasts = [action.toast, ...toastState.toasts].slice(0, TOAST_LIMIT);
      break;
    case actionTypes.UPDATE_TOAST:
      toastState.toasts = toastState.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
      break;
    case actionTypes.DISMISS_TOAST:
      toastState.toasts = toastState.toasts.map((t) =>
        t.id === action.toastId ? { ...t, open: false } : t
      );
      break;
    case actionTypes.REMOVE_TOAST:
      toastState.toasts = toastState.toasts.filter((t) => t.id !== action.toastId);
      break;
  }

  // Notify all listeners
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

// Toast functions
export function toast(props: Omit<ToasterToast, "id">) {
  const id = generateId();

  const update = (props: Partial<Omit<ToasterToast, "id">>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = React.useState<State>(toastState);

  React.useEffect(() => {
    const listener = (newState: State) => {
      setState({ ...newState });
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toast,
    toasts: state.toasts,
    dismiss: (toastId: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}
