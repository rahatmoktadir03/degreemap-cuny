import { Toaster as SonnerToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        success: {
          style: {
            background: "#10b981",
            color: "#fff",
            border: "1px solid #059669",
          },
        },
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
            border: "1px solid #dc2626",
          },
        },
        loading: {
          style: {
            background: "#3b82f6",
            color: "#fff",
            border: "1px solid #2563eb",
          },
        },
      }}
    />
  );
}
