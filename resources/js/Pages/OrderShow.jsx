import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrderShow({ order }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Order #{order.id}</h2>}>
            <Head title={`Order #${order.id}`} />
            <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="font-semibold text-gray-800">Order #{order.id}</span>
                            <span className="ml-2 text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-bold mb-2">Items</h3>
                        <ul className="divide-y divide-gray-200">
                            {order.order_items.map(item => (
                                <li key={item.id} className="flex items-center py-3">
                                    <img src={item.product && item.product.images ? `/storage/${JSON.parse(item.product.images)[0]}` : 'https://via.placeholder.com/60'} alt={item.product_name} className="w-14 h-14 object-cover rounded mr-4" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.product_name}</div>
                                        <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-semibold text-green-700">₹{item.price}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-green-700 text-lg">₹{order.total}</span>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="font-bold mb-2">Shipping Information</h3>
                    <div className="text-gray-700 text-sm space-y-1">
                        <div><span className="font-medium">Name:</span> {order.name}</div>
                        <div><span className="font-medium">Email:</span> {order.email}</div>
                        <div><span className="font-medium">Phone:</span> {order.phone}</div>
                        <div><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.state}, {order.pin}, {order.country}</div>
                    </div>
                </div>
                <Link href="/dashboard" className="inline-block mt-4 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        </AuthenticatedLayout>
    );
}
