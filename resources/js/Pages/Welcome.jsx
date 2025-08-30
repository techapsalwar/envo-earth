import { Link, Head, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Header from '@/Components/Header';

export default function Welcome({ products }) {
  const heroRef = useRef();
  const categoriesRef = useRef();
  const featuredRef = useRef();
  const promiseRef = useRef();
  const heroTitleRef = useRef();

  useEffect(() => {
    gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
    gsap.fromTo(categoriesRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: 'power2.out' });
    gsap.fromTo(featuredRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 1.0, ease: 'power2.out' });
    gsap.fromTo(promiseRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power2.out' });
    // Add hover animation for hero title
    if (heroTitleRef.current) {
      const el = heroTitleRef.current;
      const onEnter = () => {
        gsap.to(el, { scale: 1.08, rotate: 2, color: '#E2725B', duration: 0.4, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(el, { scale: 1, rotate: 0, color: '#14532d', duration: 0.4, ease: 'power2.out' });
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Head title="EnvoEarth - Conscious Living" />
  {/* Shared header */}
  <Header auth={usePage().props.auth} />

      {/* Hero Section */}
      <section ref={heroRef} className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 ref={heroTitleRef} className="text-4xl md:text-6xl font-extrabold text-green-900 mb-6 leading-tight cursor-pointer transition-colors">
          Welcome to <span className="text-green-700">EnvoEarth</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-2xl text-green-800 mb-8">
          Curated eco-friendly products for the Conscious Connoisseur. Discover a serene digital gallery where every item is a step toward a more mindful, sustainable world.
        </p>
        <Link
          href="/products"
          className="inline-block bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-800 transition"
        >
          Explore the Collection
        </Link>
      </section>

      {/* Categories Gallery */}
      <section ref={categoriesRef} className="py-12 bg-white/70">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-green-900 mb-8">Curated Categories</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          <Link href="/products?category=home" className="group block rounded-xl overflow-hidden shadow-lg bg-green-50 hover:scale-105 transition-transform">
            <img src="/images/categories/home.jpg" alt="Home & Living" className="w-full h-48 object-cover group-hover:opacity-80 transition" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-800">Home & Living</h3>
              <p className="text-green-700 text-sm mt-1">Sustainable decor, kitchenware, and more.</p>
            </div>
          </Link>
          <Link href="/products?category=wellness" className="group block rounded-xl overflow-hidden shadow-lg bg-green-50 hover:scale-105 transition-transform">
            <img src="/images/categories/wellness.jpg" alt="Wellness" className="w-full h-48 object-cover group-hover:opacity-80 transition" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-800">Wellness</h3>
              <p className="text-green-700 text-sm mt-1">Natural self-care and wellness essentials.</p>
            </div>
          </Link>
          <Link href="/products?category=fashion" className="group block rounded-xl overflow-hidden shadow-lg bg-green-50 hover:scale-105 transition-transform">
            <img src="/images/categories/fashion.jpg" alt="Fashion" className="w-full h-48 object-cover group-hover:opacity-80 transition" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-green-800">Fashion</h3>
              <p className="text-green-700 text-sm mt-1">Ethical clothing and accessories.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section ref={featuredRef} className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              let imageUrl = 'https://via.placeholder.com/300x300.png?text=No+Image';
              if (product.images) {
                  try {
                      const parsedImages = JSON.parse(product.images);
                      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                          imageUrl = `/storage/${parsedImages[0].replace(/\\/g, '')}`;
                      }
                  } catch (e) {
                      console.error("Failed to parse product card images:", e);
                  }
              }

              return (
              <Link href={`/products/${product.slug}`} key={product.id} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="overflow-hidden">
                    <img src={imageUrl} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-600 mt-2">${product.price}</p>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section ref={promiseRef} className="py-16 bg-gradient-to-b from-green-100 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Our Promise</h2>
          <p className="text-lg text-green-800 mb-6">
            EnvoEarth is more than a store—it's a movement. Every product is handpicked for its quality, sustainability, and positive impact. We believe in mindful living, ethical sourcing, and a greener tomorrow.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <img src="/icons/mother-earth-day.png" alt="Eco" className="h-10 w-10 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Eco-Conscious</h4>
              <p className="text-green-700 text-sm mt-1">Every item is vetted for minimal environmental impact.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <img src="/icons/handshake.png" alt="Ethical" className="h-10 w-10 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Ethically Sourced</h4>
              <p className="text-green-700 text-sm mt-1">We partner with brands that care for people and planet.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <img src="/icons/handle-with-care.png" alt="Curated" className="h-10 w-10 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Curated with Care</h4>
              <p className="text-green-700 text-sm mt-1">Handpicked for quality, beauty, and purpose.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="py-10 bg-green-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to live consciously?</h2>
        <p className="mb-6">Join the EnvoEarth community and start your journey toward mindful living.</p>
        <Link
          href="/products"
          className="inline-block bg-white text-green-900 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-100 transition"
        >
          Shop Now
        </Link>
      </footer>
    </div>
  );
}
