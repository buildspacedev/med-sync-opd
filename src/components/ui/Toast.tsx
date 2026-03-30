import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl min-w-[300px] border
                ${t.type === "success" ? "bg-white text-success border-success/20" : ""}
                ${t.type === "error" ? "bg-white text-error border-error/20" : ""}
                ${t.type === "warning" ? "bg-white text-warning border-warning/20" : ""}
                ${t.type === "info" ? "bg-white text-info border-info/20" : ""}
              `}
            >
              <div className="shrink-0">
                {t.type === "success" && <CheckCircle2 size={24} />}
                {t.type === "error" && <AlertCircle size={24} />}
                {t.type === "warning" && <AlertCircle size={24} />}
                {t.type === "info" && <Info size={24} />}
              </div>
              <p className="flex-1 font-bold text-text-primary text-sm">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} className="text-text-tertiary" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
