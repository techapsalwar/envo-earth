import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CartBadge from './CartBadge'; // Adjust the import path as necessary

export default function Header({ auth }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();

    // derive current pathname and category query param
    let currentPath = '/';
    let currentCategory = null;
    try {
        const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        currentPath = parsed.pathname;
        currentCategory = parsed.searchParams.get('category');
    } catch (e) {
        // fallback
        if (typeof window !== 'undefined') {
            const parsed = new URL(window.location.href);
            currentPath = parsed.pathname;
            currentCategory = parsed.searchParams.get('category');
        }
    }

    const navLinks = [
        { label: 'All Products', href: '/products', cat: null },
        { label: 'Plants', href: '/products?category=1', cat: '1' },
        { label: 'Planters', href: '/products?category=2', cat: '2' },
        { label: 'Art', href: '/products?category=3', cat: '3' },
        { label: 'Fountain', href: '/products?category=4', cat: '4' },
        { label: 'Combo', href: '/products?category=5', cat: '5' },
        { label: 'Contact', href: '/contact', cat: null },
    ];

    const isActive = (link) => {
        if (link.href === '/contact') return currentPath === '/contact';
        if (link.href.startsWith('/products')) {
            if (!link.cat) {
                // All products
                return currentPath === '/products' && !currentCategory;
            }
            return currentPath.startsWith('/products') && currentCategory === link.cat;
        }
        return false;
    };

    return (
        <div>
            {/* Floating centered navbar with light background and dark text */}
            <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 border border-gray-200 rounded-full pt-3 pr-6 pb-3 pl-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between w-[96vw] max-w-5xl">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                            </svg>
                            <span className="ml-2 text-base font-semibold text-gray-800">EnvoEarth</span>
                        </Link>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center space-x-4 text-sm text-gray-700 ml-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative px-2 py-1 rounded-md transition-all duration-200 text-sm ${isActive(link) ? 'text-green-900 font-semibold bg-green-50 shadow-[0_8px_30px_rgba(16,185,129,0.10)]' : 'text-gray-700 hover:text-green-900 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                            </svg>
                        </button>

                        <Link href="/cart" className="relative text-gray-700 hover:text-gray-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <CartBadge />
                        </Link>

                        {auth?.user ? (
                            <Link href={route('dashboard')} className="hidden md:inline-block text-sm font-medium text-gray-800 hover:text-gray-900 transition-colors">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="hidden md:inline-block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Log in</Link>
                                <Link href={route('register')} className="hidden md:inline-block text-sm font-medium text-gray-800 bg-gray-100 rounded-full pt-2 pr-4 pb-2 pl-4 hover:shadow-sm transition-colors">Register</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {open && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-18 w-[94vw] max-w-md bg-white rounded-lg shadow-lg p-5 z-50">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`text-gray-800 ${isActive(link) ? 'font-semibold text-green-900' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-2">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="text-gray-800">Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-gray-800">Log in</Link>
                                        <Link href={route('register')} className="text-gray-800 bg-gray-100 rounded-full inline-block px-3 py-1">Register</Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </nav>

            {/* Spacer so content doesn't sit under the fixed nav */}
            <div className="h-28 md:h-20"></div>
        </div>
    );
}