import AdminLayout from '@/Layouts/AdminLayout';
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
        <AdminLayout title={`Order #${order.id}`}>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Order #{order.id}</h1>
                        <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`/admin/orders/${order.id}/invoice`}
                            target="_blank"
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Invoice
                        </a>
                        <Link
                            href="/admin/orders"
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.order_items && order.order_items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                            <div className="flex items-center space-x-4">
                                                {item.product && item.product.images && (
                                                    <img
                                                        src={`/storage/${JSON.parse(item.product.images)[0]}`}
                                                        alt={item.product_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                                    <p className="text-gray-600">Price: ₹{parseFloat(item.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{parseFloat(order.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {order.name}</p>
                                <p><span className="font-medium">Email:</span> {order.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>{order.address}</p>
                                <p>{order.city}, {order.state}</p>
                                {order.pin && <p>PIN: {order.pin}</p>}
                                <p>{order.country}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Items ({order.order_items ? order.order_items.length : 0})</span>
                                    <span>₹{parseFloat(order.total).toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>₹{parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}