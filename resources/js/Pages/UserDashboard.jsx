import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function UserDashboard({ cartItems, activeOrders, pastOrders }) {
    const { showToast } = useToast();
    const [stepOrderId, setStepOrderId] = useState(null);
    const [step, setStep] = useState(0);

    // Progress steps for order status
    const steps = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const getStep = (status) => steps.indexOf(status);

    // Handle proceed to buy
    const handleCheckout = () => {
        router.get('/checkout');
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold leading-tight text-gray-900">My Dashboard</h2>}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-7xl mx-auto px-4 space-y-8">
                {/* Cart Section */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Current Cart</h3>
                    {cartItems.length === 0 ? (
                        <div className="text-gray-500">Your cart is empty.</div>
                    ) : (
                        <div>
                            <ul className="divide-y divide-gray-100 mb-4">
                                {cartItems.map((item, idx) => (
                                    <li key={idx} className="flex items-center py-3">
                                        <img src={item.product.images ? `/storage/${JSON.parse(item.product.images)[0]}` : 'https://via.placeholder.com/60'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg mr-4 border" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{item.product.name}</div>
                                            <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold text-green-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.product.price)}</div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center justify-end">
                                <button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md font-semibold transition">Proceed to Buy</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Orders Section */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Active Orders</h3>
                    {activeOrders.length === 0 ? (
                        <div className="text-gray-500">No active orders.</div>
                    ) : (
                        <div className="space-y-6">
                            {activeOrders.map(order => (
                                <div key={order.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="font-semibold text-gray-900">Order #{order.id}</span>
                                            <span className="ml-2 text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                    </div>

                                    {/* Progress Step Bar */}
                                    <div className="flex items-center space-x-2 mt-2 mb-4">
                                        {steps.slice(0, 4).map((s, idx) => (
                                            <div key={s} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getStep(order.status) >= idx ? 'bg-green-600' : 'bg-gray-200'}`}>{idx + 1}</div>
                                                {idx < 3 && <div className={`w-12 h-1 ${getStep(order.status) > idx ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-sm text-gray-700 mb-2">{order.order_items.length} items | Total: <span className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.total)}</span></div>
                                    <div className="flex justify-end">
                                        <Link href={`/orders/${order.id}`} className="text-green-700 hover:underline text-sm font-medium">View Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Orders Section */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Previous Orders</h3>
                    {pastOrders.length === 0 ? (
                        <div className="text-gray-500">No previous orders.</div>
                    ) : (
                        <div className="space-y-6">
                            {pastOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm">
                                    <div>
                    <span className="font-semibold text-gray-900">Order #{order.id}</span>
                                        <span className="ml-2 text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                                        <span className={`ml-4 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                    </div>
                                    <div className="text-sm text-gray-700 mt-2 md:mt-0">{order.order_items.length} items | Total: <span className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.total)}</span></div>
                                    <Link href={`/orders/${order.id}`} className="text-green-700 hover:underline text-sm ml-0 md:ml-4">View Details</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
