import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();

    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-5 right-5 z-[9999] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-xl text-sm shadow-lg backdrop-blur-lg border
              animate-slideIn
              ${
                toast.type === "success"
                  ? "bg-green-500/20 border-green-400/30 text-green-300"
                  : toast.type === "error"
                  ? "bg-red-500/20 border-red-400/30 text-red-300"
                  : "bg-blue-500/20 border-blue-400/30 text-blue-300"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);