// File: resources/js/Pages/Categories/Show.jsx

import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import Pagination from '@/Components/Pagination';

// This page receives both 'category' and 'products' as props from the controller
export default function Show({ category, products }) {
    return (
        <MainLayout>
            {/* Use the category's name for the page title */}
            <Head title={category.name} />

            <div className="container mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {category.name}
                    </h1>
                    {/* Display the category description if it exists */}
                    {category.description && (
                         <p className="mt-4 text-base text-gray-500">{category.description}</p>
                    )}
                </div>

                {/* Product Grid - This is identical to our Products/Index page */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination - Also identical */}
                <Pagination links={products.links} />
            </div>
        </MainLayout>
    );
}