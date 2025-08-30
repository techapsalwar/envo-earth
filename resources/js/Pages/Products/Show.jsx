// File: resources/js/Pages/Products/Show.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

// The 'product' prop is passed from our ProductController's show method
export default function Show({ product }) {
    // --- START OF ROBUST FIX ---
    // This is the most important part. It handles all possible cases.
    let images = [];
    try {
        // First, try to parse it as JSON if it's a string
        const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        // Then, ensure the result is an array
        images = Array.isArray(parsedImages) ? parsedImages : [];
    } catch (e) {
        // If JSON.parse fails or any other error, default to an empty array
        images = [];
    }
    // --- END OF ROBUST FIX ---

    const { showToast } = useToast();

    // A simple state to manage which image is currently displayed
    const [activeImage, setActiveImage] = useState(
        images.length > 0
            ? `/storage/${images[0].replace(/\\/g, '')}` // Also clean up any extra slashes
            : 'https://via.placeholder.com/600x600.png?text=No+Image'
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(price);
    };

    // Add to cart handler
    const handleAddToCart = async () => {
        try {
            await window.axios.post('/cart/add', { product_id: product.id, quantity: 1 });
            showToast('Added to cart!');
            window.dispatchEvent(new Event('cart-updated'));
        } catch (err) {
            showToast('Failed to add to cart');
        }
    };

    return (
        <MainLayout>
            <Head title={product.name} />
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery Section */}
                    <div>
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        {/* Thumbnails (if more than one image exists) */}
                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-5 gap-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(`/storage/${image[0].replace(/\\/g, '')}`)}
                                        className={`rounded-lg overflow-hidden border-2 ${
                                            activeImage === `/storage/${image}` ? 'border-transparent' : 'border-green-600'
                                        }`}
                                    >
                                        <img src={`/storage/${image[0].replace(/\\/g, '')}`} alt="..." />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                        <div className="mt-4">
                            <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
                        </div>
                        <div className="mt-6 space-y-6">
                            <p className="text-base text-gray-700">{product.description}</p>
                        </div>
                        <div className="mt-10">
                            <button
                                className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-lg font-semibold transition-colors"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}