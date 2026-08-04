import React, { createContext, useContext, useState, useCallback } from "react";
import { MdCheckCircle, MdError, MdClose } from "react-icons/md";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 30000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between w-80 p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-x-0 opacity-100 ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === "success" ? (
                <MdCheckCircle className="text-green-500 text-xl flex-shrink-0" />
              ) : (
                <MdError className="text-red-500 text-xl flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="text-lg" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
