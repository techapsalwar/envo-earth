import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { search, category }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${productId}`, {
                method: 'delete',
                onSuccess: () => {
                    // Optional: show success message
                }
            });
        }
    };

    return (
        <AdminLayout title="Products Management">
            <Head title="Products" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                    <Link
                        href="/admin/products/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Products
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by product name..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                {categories && categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
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

                {/* Products Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {products && products.data && products.data.length > 0 ? (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.data.map((product) => {
                                        // Parse images safely
                                        let productImages = [];
                                        try {
                                            productImages = product.images ? JSON.parse(product.images) : [];
                                        } catch (e) {
                                            productImages = [];
                                        }

                                        return (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={productImages.length > 0 ? `/storage/${productImages[0]}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyNUMyNSAyNi42NTY5IDI2LjM0MzEgMjggMjggMjhDMjkuNjU2OSAyOCAzMSAyNi42NTY5IDMxIDI1QzMxIDIzLjM0MzEgMjkuNjU2OSAyMiAyOCAyMkMyNi4zNDMxIDIyIDI1IDIzLjM0MzEgMjUgMjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAzNkwyNCAzMkwyOCAzNkwzMiAzMkwzNiAzNlY0MEgyMFYzNloiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cg=='}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.category ? product.category.name : 'No Category'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{parseFloat(product.price || 0).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.stock_quantity ?? 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        product.stock_quantity > 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.stock_quantity > 0 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Fixed Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {products.from || 0} to {products.to || 0} of {products.total || 0} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {products.links.map((link, index) => {
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
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}