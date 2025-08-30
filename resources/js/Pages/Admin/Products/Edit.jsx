import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function ProductEdit({ product, categories }) {
  const { data, setData, put, processing, errors } = useForm({
    name: product.name || '',
    category_id: product.category_id || '',
    description: product.description || '',
    price: product.price || '',
    sale_price: product.sale_price || '',
    stock_quantity: product.stock_quantity || 0,
    sku: product.sku || '',
    product_type: product.product_type || '',
    is_featured: product.is_featured ? true : false,
    images: [], // for new uploads
  });
  const [previewImages, setPreviewImages] = useState(() => {
    try {
      return product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
    } catch {
      return [];
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setData(name, checked);
    } else if (type === 'file') {
      setData(name, files);
      setPreviewImages(Array.from(files).map(f => URL.createObjectURL(f)));
    } else {
      setData(name, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    // Always append images as 'images' (not 'new_images') for backend consistency
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    formData.append('_method', 'PUT');
    // Use Inertia's router.post with _method=PUT for file upload
    router.post(`/admin/products/${product.id}`, formData, {
      forceFormData: true,
      onError: () => {},
      onFinish: () => {},
    });
  };

  return (
    <AdminLayout title={`Edit Product: ${product.name}`}> 
      <Head title={`Edit ${product.name}`} />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select name="category_id" value={data.category_id} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <div className="text-red-500 text-sm">{errors.category_id}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea name="description" value={data.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input type="number" name="price" value={data.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Sale Price</label>
              <input type="number" name="sale_price" value={data.sale_price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.sale_price && <div className="text-red-500 text-sm">{errors.sale_price}</div>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Stock Quantity</label>
              <input type="number" name="stock_quantity" value={data.stock_quantity} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.stock_quantity && <div className="text-red-500 text-sm">{errors.stock_quantity}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">SKU</label>
              <input type="text" name="sku" value={data.sku} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              {errors.sku && <div className="text-red-500 text-sm">{errors.sku}</div>}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Product Type</label>
            <input type="text" name="product_type" value={data.product_type} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.product_type && <div className="text-red-500 text-sm">{errors.product_type}</div>}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" checked={data.is_featured} onChange={handleChange} />
            <label className="font-medium">Featured</label>
          </div>
          <div>
            <label className="block font-medium mb-1">Images</label>
            <input type="file" name="images" multiple onChange={handleChange} className="w-full" />
            <div className="flex gap-2 mt-2">
              {previewImages.length > 0 ? previewImages.map((img, idx) => (
                <img key={idx} src={typeof img === 'string' ? (img.startsWith('blob:') ? img : `/storage/${img}`) : img} alt="Preview" className="w-16 h-16 object-cover rounded" />
              )) : <span className="text-gray-500">No images</span>}
            </div>
          </div>
          <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/products" className="ml-4 text-gray-600 hover:underline">Cancel</Link>
        </form>
      </div>
    </AdminLayout>
  );
}
