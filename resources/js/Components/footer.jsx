export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t mt-auto">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-500">
                    <p>© {new Date().getFullYear()} EnvoEarth. An EnvoKlear Brand. All Rights Reserved.</p>
                </div>
                <nav className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
                    <a href="/about-us" className="hover:text-gray-800 hover:underline">About Us</a>
                    <span className="border-l border-gray-300"></span>
                    <a href="/contact" className="hover:text-gray-800 hover:underline">Contact</a>
                    <span className="border-l border-gray-300"></span>
                    <a href="/privacy-policy" className="hover:text-gray-800 hover:underline">Privacy Policy</a>
                </nav>
            </div>
        </footer>
    );
}