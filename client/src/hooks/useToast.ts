import toast from "react-hot-toast";

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  const warning = (message: string) => {
    toast(message);
  };

  const info = (message: string) => {
    toast(message);
  };

  const loading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return { success, error, warning, info, loading, dismiss };
};
