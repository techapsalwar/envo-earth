// File: resources/js/Components/CartBadge.jsx
import { useEffect, useState } from 'react';

export default function CartBadge() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const fetchCount = () => {
            window.axios.get('/cart-count').then(res => setCount(res.data.count)).catch(() => setCount(0));
        };
        fetchCount();
        // Listen for cart updates
        window.addEventListener('cart-updated', fetchCount);
        return () => window.removeEventListener('cart-updated', fetchCount);
    }, []);
    if (!count) return null;
    return (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {count}
        </span>
    );
}
