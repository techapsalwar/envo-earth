import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function CreateProduct({ categories }) {
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        sale_price: '',
        stock_quantity: '',
        category_id: '',
        sku: '',
        product_type: 'simple',
        is_featured: false,
        images: [],
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData({...data, images: files});

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removeImage = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = previewImages.filter((_, i) => i !== index);
        setData({...data, images: newImages});
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.sale_price) {
            formData.append('sale_price', data.sale_price);
        }
        formData.append('stock_quantity', data.stock_quantity);
        formData.append('category_id', data.category_id);
        if (data.sku) {
            formData.append('sku', data.sku);
        }
        formData.append('product_type', data.product_type);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        
        // Append images
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        router.post('/admin/products', formData, {
            onSuccess: () => {
                // Success handled by redirect
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AdminLayout title="Create Product">
            <div className="mb-6">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Products
                </Link>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Create Product</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Add a new product to your catalog with images, pricing, and inventory information.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    {/* Product Name */}
                                    <div className="col-span-6 sm:col-span-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData({...data, name: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* SKU */}
                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData({...data, sku: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Optional"
                                        />
                                        {errors.sku && <p className="mt-2 text-sm text-red-600">{errors.sku}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            required
                                            value={data.description}
                                            onChange={(e) => setData({...data, description: e.target.value})}
                                            className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        />
                                        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            step="0.01"
                                            min="0"
                                            required
                                            value={data.price}
                                            onChange={(e) => setData({...data, price: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
                                    </div>

                                    {/* Sale Price */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700">
                                            Sale Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="sale_price"
                                            id="sale_price"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price}
                                            onChange={(e) => setData({...data, sale_price: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Optional"
                                        />
                                        {errors.sale_price && <p className="mt-2 text-sm text-red-600">{errors.sale_price}</p>}
                                    </div>

                                    {/* Stock Quantity */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="stock_quantity"
                                            id="stock_quantity"
                                            min="0"
                                            required
                                            value={data.stock_quantity}
                                            onChange={(e) => setData({...data, stock_quantity: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.stock_quantity && <p className="mt-2 text-sm text-red-600">{errors.stock_quantity}</p>}
                                    </div>

                                    {/* Category */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                            Category *
                                        </label>
                                        <select
                                            name="category_id"
                                            id="category_id"
                                            required
                                            value={data.category_id}
                                            onChange={(e) => setData({...data, category_id: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Category</option>
                                            {categories && categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-2 text-sm text-red-600">{errors.category_id}</p>}
                                    </div>

                                    {/* Product Type */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">
                                            Product Type *
                                        </label>
                                        <select
                                            name="product_type"
                                            id="product_type"
                                            required
                                            value={data.product_type}
                                            onChange={(e) => setData({...data, product_type: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        >


                                            <option value="simple">Simple Product</option>
                                            <option value="variable">Variable Product</option>
                                            <option value="digital">Digital Product</option>
                                            <option value="service">Service</option>
                                        </select>
                                        {errors.product_type && <p className="mt-2 text-sm text-red-600">{errors.product_type}</p>}
                                    </div>


                                    {/* Is Featured */}
                                    <div className="col-span-6 sm:col-span-3">











                                        <div className="flex items-center">
                                            <input
                                                id="is_featured"
                                                name="is_featured"
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={(e) => setData({...data, is_featured: e.target.checked})}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                                Featured Product
                                            </label>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Featured products will be highlighted on the homepage
                                        </p>
                                        {errors.is_featured && <p className="mt-2 text-sm text-red-600">{errors.is_featured}</p>}
                                    </div>

                                    {/* Product Images */}
                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Product Images
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload files</span>
                                                        <input
                                                            id="images"
                                                            name="images"
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 2MB each
                                                </p>
                                            </div>
                                        </div>
                                        {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
                                        
                                        {/* Image Previews */}
                                        {previewImages.length > 0 && (

















                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews:</h4>
                                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                    {previewImages.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="h-24 w-full object-cover rounded-lg border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                                <Link
                                    href="/admin/products"
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}

                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Product'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}