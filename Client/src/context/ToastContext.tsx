import { Toast } from "primereact/toast";
import { createContext, useContext, useRef, type ReactNode } from "react";

type ToastContextType = {
  toast: React.RefObject<Toast | null>;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useRef<Toast | null>(null);

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}

export function UseToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context.toast;
}
