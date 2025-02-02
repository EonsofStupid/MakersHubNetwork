import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    className: "bg-zinc-900 border border-zinc-800 text-zinc-100",
    duration: 2000,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    className: "bg-zinc-900 border border-zinc-800 text-zinc-100",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    className: "bg-zinc-900 border border-zinc-800 text-zinc-100",
    duration: 3000,
  });
};