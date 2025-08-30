// File: resources/js/Pages/Products/Index.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import Pagination from '@/Components/Pagination'; 

// The 'products' prop is passed from our ProductController
export default function Index({ products, filters }) {
    return (
        <MainLayout>
            <Head title="All Products" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-900 mb-2">{filters?.category_name ? `Category: ${filters.category_name}` : (filters?.category ? `Category: ${filters.category}` : 'Discover Our Collection')}</h1>
                        <p className="text-green-800 text-lg max-w-xl">Curated eco-friendly products for conscious living. Browse by category or explore all.</p>
                    </div>
                    {/* Example filter UI (expand as needed) */}
                    {/* <div className="flex gap-2">
                        <select className="border rounded px-3 py-2 text-green-900">
                            <option>All Categories</option>
                            <option>Home & Living</option>
                            <option>Wellness</option>
                            <option>Fashion</option>
                        </select>
                        <input type="text" placeholder="Search products..." className="border rounded px-3 py-2" />
                    </div> */}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                    <Pagination links={products.links} />
                </div>
            </div>
        </MainLayout>
    );
}