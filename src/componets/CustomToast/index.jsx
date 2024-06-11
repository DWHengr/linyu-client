import React, {useState, useEffect, createContext, useContext} from 'react';
import "./index.less"

const Toast = ({message, duration, onClose, error}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${error ? "error" : ""}`}>
            {message}
        </div>
    );
};


const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, error = false, duration = 2000,) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts([...toasts, {id, message, duration, error}]);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        duration={toast.duration}
                        error={toast.error}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
