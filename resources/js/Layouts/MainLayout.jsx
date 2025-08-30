import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    // The usePage() hook gives access to props shared with every page from Laravel.
    // We can get the `auth` object here and pass it down to any component that needs it.
    const { auth } = usePage().props;

    return (
        // This outer div uses a flex-column layout to make the footer sticky.
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">

            {/* Render the Header, passing the auth prop down to it */}
            <Header auth={auth} />

            {/* The main content area of the page */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Render the Footer with white background to match site theme */}
            <Footer className="bg-white shadow-inner" />

        </div>
    );
}