// File: resources/js/Components/ProductCard.jsx

import { Link } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';
import { useEffect, useState } from 'react';

// A function to format the price
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR', // Change to your desired currency
    }).format(price);
};

export default function ProductCard({ product }) {
    // --- START OF FIX ---
    // Apply the same robust logic here as we did on the Show page.
    let imageUrl = 'https://via.placeholder.com/300x300.png?text=No+Image';
    if (product.images) {
        try {
            const parsedImages = JSON.parse(product.images);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                // Clean up any extra slashes and set the URL
                imageUrl = `/storage/${parsedImages[0].replace(/\\/g, '')}`;
            }
        } catch (e) {
            console.error("Failed to parse product card images:", e);
        }
    }
    // --- END OF FIX ---

    const { showToast } = useToast();

    // Price handling: sale price may be stored separately on product.sale_price
    const regularPrice = product.sale_price ? Number(product.price) : Number(product.price);
    const salePrice = product.sale_price ? Number(product.sale_price) : null;
    const hasDiscount = salePrice && salePrice < regularPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    return (
        <div className="group relative rounded-2xl overflow-hidden bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(16,24,40,0.12)] h-full flex flex-col">
            {/* Discount badge */}
            {hasDiscount && (
                <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-semibold rounded-full px-3 py-1 shadow-lg">-{discountPercent}%</div>
            )}
            <Link href={`/products/${product.slug}`} className="block flex-none">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-green-100 to-green-50 relative">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 group-hover:opacity-95 transition-transform duration-300"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </Link>
            {/* Content grows to fill space so button stays aligned */}
            <div className="p-4 flex-1 flex flex-col justify-start gap-3">
                <h3 className="text-base text-gray-900 font-semibold truncate group-hover:text-gray-800 transition-colors">
                    {product.name}
                </h3>
                <div className="mt-1 flex items-end gap-3">
                    {hasDiscount ? (
                        <>
                            <div className="text-sm text-gray-500 line-through">{formatPrice(regularPrice)}</div>
                            <div className="text-lg font-bold text-gray-900">{formatPrice(salePrice)}</div>
                        </>
                    ) : (
                        <div className="text-lg font-bold text-gray-900">{formatPrice(regularPrice)}</div>
                    )}
                </div>
            </div>
            {/* Footer with button - fixed at bottom */}
            <div className="p-4 pt-0 flex-none">
                <button
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                    onClick={async e => {
                        e.preventDefault();
                        try {
                            await window.axios.post('/cart/add', { product_id: product.id, quantity: 1 });
                            showToast('Added to cart!');
                            window.dispatchEvent(new Event('cart-updated'));
                        } catch (err) {
                            showToast('Failed to add to cart');
                        }
                    }}
                >
                    <span className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" /></svg>
                        Add to Cart
                    </span>
                </button>
            </div>
        </div>
    );
}