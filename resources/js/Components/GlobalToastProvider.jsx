// File: resources/js/Components/GlobalToastProvider.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext({ showToast: () => {} });

export function useToast() {
    return useContext(ToastContext);
}

export function GlobalToastProvider({ children }) {
    const [message, setMessage] = useState('');
    const showToast = useCallback((msg) => {
        setMessage(msg);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={message} onClose={() => setMessage('')} />
        </ToastContext.Provider>
    );
}
