// File: resources/js/Pages/Cart/Index.jsx
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function CartIndex({ cartItems }) {
    const { auth } = usePage().props;
    const { showToast } = useToast();
    // Use persistent cart routes for logged-in users
    const cartRoute = auth?.user ? '/cart' : '/cart'; // Route is the same, but backend now handles persistent cart for logged-in users
    const handleRemove = (productId) => {
        router.post(cartRoute + '/remove', { product_id: productId }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Item removed from cart!');
                window.dispatchEvent(new Event('cart-updated'));
            },
            onError: () => showToast('Failed to remove item'),
        });
    };
    const handleClear = () => {
        router.post(cartRoute + '/clear', {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Cart cleared!');
                window.dispatchEvent(new Event('cart-updated'));
            },
            onError: () => showToast('Failed to clear cart'),
        });
    };
    const handleUpdate = (productId, quantity) => {
        router.post(cartRoute + '/update', { product_id: productId, quantity }, {
            preserveScroll: true,
            onSuccess: () => showToast('Cart updated!'),
            onError: () => showToast('Failed to update cart'),
        });
    };
    return (
        <MainLayout>
            <Head title="Your Cart" />
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="text-gray-500">Your cart is empty.</div>
                ) : (
                    <>
                        <table className="min-w-full bg-white border rounded-lg mb-8">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Product</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(({ product, quantity }) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-2 flex items-center">
                                            {/* Product Image */}
                                            {(() => {
                                                let imageUrl = 'https://via.placeholder.com/60x60.png?text=No+Image';
                                                if (product.images) {
                                                    try {
                                                        const parsedImages = JSON.parse(product.images);
                                                        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                                                            imageUrl = `/storage/${parsedImages[0].replace(/\\/g, '')}`;
                                                        }
                                                    } catch (e) {}
                                                }
                                                return (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="w-14 h-14 object-cover rounded mr-3 border"
                                                    />
                                                );
                                            })()}
                                            <span>{product.name}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={e => handleUpdate(product.id, parseInt(e.target.value))}
                                                className="w-16 border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">₹{product.price}</td>
                                        <td className="px-4 py-2">₹{(product.price * quantity).toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => handleRemove(product.id)} className="text-red-600 hover:underline">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-8">
                            <button onClick={handleClear} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Clear Cart</button>
                            <div className="flex items-center space-x-4">
                                <div className="text-xl font-bold">
                                    Total: ₹{cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0).toFixed(2)}
                                </div>
                                <a
                                    href="/checkout"
                                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-lg font-semibold"
                                >
                                    Checkout
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
