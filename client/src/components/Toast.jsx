import { useToast } from "../context/ToastContext";
import "../assets/css/toast.css";

export const Toast = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} ${toast.show ? "toast-show" : "toast-hide"}`}
          onClick={() => hideToast(toast.id)}
        >
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button onClick={() => hideToast(toast.id)} className="toast-close">
              ×
            </button>
          </div>
          <div className="toast-progress"></div>
        </div>
      ))}
    </div>
  );
};
