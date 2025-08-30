import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ShowProduct({ product }) {
    // Helper function to parse and clean image paths
    const getImageUrls = (images) => {
        if (!images) return [];
        
        let imageArray = [];
        try {
            // Handle if images is already an array
            if (Array.isArray(images)) {
                imageArray = images;
            } else if (typeof images === 'string') {
                // Parse JSON string and handle escaped backslashes
                imageArray = JSON.parse(images);
            }
            
            // Clean the paths by removing extra backslashes
            return imageArray.map(image => {
                const cleanPath = image.replace(/\\\//g, '/');
                return `/storage/${cleanPath}`;
            });
        } catch (e) {
            console.error('Error parsing images:', e);
            return [];
        }
    };

    // --- START OF FIX ---
    // Use the same logic as ProductCard for image URL
    let productImages = [];
    if (product.images) {
        try {
            productImages = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
        } catch (e) {
            productImages = [];
        }
    }
    let imageUrl = 'https://via.placeholder.com/300x300.png?text=No+Image';
    if (Array.isArray(productImages) && productImages.length > 0) {
        imageUrl = `/storage/${productImages[0].replace(/\\/g, '')}`;
    }
    // --- END OF FIX ---

    return (
        <AdminLayout title={`Product: ${product.name}`}>
            <Head title={`Product: ${product.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-1" />
                            Back to Products
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Product
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Images */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                            {productImages.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={`${product.name} - Image`}
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
                                            Primary
                                        </span>
                                    </div>
                                </div>
                            ) : (

                                <div className="text-center py-8">
                                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">No images uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-2">










                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{product.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                                        <p className="mt-1 text-sm text-gray-900">{product.sku || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {product.category ? product.category.name : 'No category assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                                        <p className="mt-1 text-sm text-gray-900 capitalize">{product.product_type}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                        {product.description}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Regular Price</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{parseFloat(product.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                                        <p className="mt-1 text-lg font-semibold text-green-600">
                                            {product.sale_price ? `₹${parseFloat(product.sale_price).toFixed(2)}` : 'Not set'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{product.stock_quantity} units</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Featured Product</label>
                                        <p className="mt-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.is_featured 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.is_featured ? 'Yes' : 'No'}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                                        <p className="mt-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.stock_quantity > 10 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : product.stock_quantity > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock_quantity > 10 
                                                    ? 'In Stock' 
                                                    : product.stock_quantity > 0
                                                    ? 'Low Stock'
                                                    : 'Out of Stock'
                                                }
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Created At</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(product.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(product.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
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
