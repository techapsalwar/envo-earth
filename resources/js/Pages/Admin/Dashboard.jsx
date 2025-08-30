import AdminLayout from '@/Layouts/AdminLayout';
import {
    UsersIcon,
    CubeIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard({ stats, recent_orders }) {
    const cards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: UsersIcon,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: CubeIcon,
            color: 'bg-green-500',
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: ClipboardDocumentListIcon,
            color: 'bg-yellow-500',
        },
        {
            title: 'Total Revenue',
            value: `₹${parseFloat(stats.total_revenue || 0).toFixed(2)}`,
            icon: CurrencyDollarIcon,
            color: 'bg-purple-500',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={`w-8 h-8 ${card.color} rounded-md flex items-center justify-center`}>
                                                <IconComponent className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {card.title}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {card.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Recent Orders
                        </h3>
                        {recent_orders && recent_orders.length > 0 ? (
                            <div className="overflow-hidden">
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
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recent_orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.user ? order.user.name : order.guest_name || 'Guest'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">No recent orders found.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
