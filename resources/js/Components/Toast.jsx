// File: resources/js/Components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 2500);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;
    return (
        <div className="fixed top-6 right-6 z-50">
            <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
                {message}
            </div>
        </div>
    );
}
