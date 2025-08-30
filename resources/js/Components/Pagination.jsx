// File: resources/js/Components/Pagination.jsx

import { Link } from '@inertiajs/react';

// The 'links' prop will be an array of link objects provided by Laravel's paginator
export default function Pagination({ links }) {
    return (
        <nav className="text-center mt-12">
            <div className="inline-flex -space-x-px">
                {links.map((link, index) => (
                    // If the link is not active and has a URL, render an Inertia Link
                    link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-4 py-2 text-sm font-medium border ${
                                link.active
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                            } ${index === 0 ? 'rounded-l-md' : ''} ${
                                index === links.length - 1 ? 'rounded-r-md' : ''
                            }`}
                            // This preserves the scroll position when changing pages
                            preserveScroll
                        >
                            {/* Use dangerouslySetInnerHTML to render HTML entities like « */}
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ) : (
                        // Otherwise, render a disabled span (for "..." or inactive prev/next)
                        <span
                            key={index}
                            className={`px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 ${
                                index === 0 ? 'rounded-l-md' : ''
                            } ${index === links.length - 1 ? 'rounded-r-md' : ''}`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </span>
                    )
                ))}
            </div>
        </nav>
    );
}