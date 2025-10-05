"use client";

import {
   createContext,
   useContext,
   useState,
   useCallback,
   ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
   id: string;
   type: ToastType;
   title: string;
   description?: string;
   duration?: number;
}

interface ToastContextType {
   toasts: Toast[];
   addToast: (toast: Omit<Toast, "id">) => void;
   removeToast: (id: string) => void;
   success: (title: string, description?: string) => void;
   error: (title: string, description?: string) => void;
   warning: (title: string, description?: string) => void;
   info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
   const [toasts, setToasts] = useState<Toast[]>([]);

   const addToast = useCallback((toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
         ...toast,
         id,
         duration: toast.duration || 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      setTimeout(() => {
         removeToast(id);
      }, newToast.duration);
   }, []);

   const removeToast = useCallback((id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   }, []);

   const success = useCallback(
      (title: string, description?: string) => {
         addToast({ type: "success", title, description });
      },
      [addToast]
   );

   const error = useCallback(
      (title: string, description?: string) => {
         addToast({ type: "error", title, description });
      },
      [addToast]
   );

   const warning = useCallback(
      (title: string, description?: string) => {
         addToast({ type: "warning", title, description });
      },
      [addToast]
   );

   const info = useCallback(
      (title: string, description?: string) => {
         addToast({ type: "info", title, description });
      },
      [addToast]
   );

   return (
      <ToastContext.Provider
         value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            warning,
            info,
         }}
      >
         {children}
         <ToastContainer toasts={toasts} onRemove={removeToast} />
      </ToastContext.Provider>
   );
}

export function useToast() {
   const context = useContext(ToastContext);
   if (context === undefined) {
      throw new Error("useToast must be used within a ToastProvider");
   }
   return context;
}

interface ToastContainerProps {
   toasts: Toast[];
   onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
   return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
         {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
         ))}
      </div>
   );
}

interface ToastItemProps {
   toast: Toast;
   onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
   const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info,
   };

   const colors = {
      success:
         "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
      error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
      warning:
         "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
   };

   const Icon = icons[toast.type];

   return (
      <div
         className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full",
            colors[toast.type]
         )}
      >
         <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
         <div className="flex-1 min-w-0">
            <p className="font-medium">{toast.title}</p>
            {toast.description && (
               <p className="text-sm opacity-90 mt-1">{toast.description}</p>
            )}
         </div>
         <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
         >
            <X className="h-4 w-4" />
         </button>
      </div>
   );
}
