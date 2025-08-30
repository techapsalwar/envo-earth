import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';

export default function OrdersIndex({ orders, statuses, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const { showToast } = useToast();

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', { search, status }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusChange = (orderId, newStatus) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Order status updated!');
            }
        });
    };

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
        <AdminLayout title="Orders Management">
            <Head title="Orders" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Orders
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order ID, customer name, or email..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Statuses</option>
                                {statuses && statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {orders && orders.data && orders.data.length > 0 ? (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.data.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.name}</div>
                                                <div className="text-sm text-gray-500">{order.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₹{parseFloat(order.total).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </Link>
                                                <a
                                                    href={`/admin/orders/${order.id}/invoice`}
                                                    target="_blank"
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Invoice
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this order?')) {
                                                            router.delete(`/admin/orders/${order.id}`);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Fixed Pagination */}
                            {orders.links && orders.links.length > 3 && (
                                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {orders.from || 0} to {orders.to || 0} of {orders.total || 0} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {orders.links.map((link, index) => {
                                                // Skip links with null URLs
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm rounded ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No orders found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}