import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function OrderPlaced({ order }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.visit('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Graceful fallback for order data
  const orderId = order?.id || 'N/A';
  const orderDate = order?.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A';
  const totalItems = Array.isArray(order?.order_items) ? order.order_items.length : 0;
  const total = order?.total ? Number(order.total).toFixed(2) : '0.00';
  const name = order?.name || '';
  const email = order?.email || '';
  const phone = order?.phone || '';
  const address = order?.address || '';
  const city = order?.city || '';
  const state = order?.state || '';
  const pin = order?.pin || '';
  const country = order?.country || '';
  const items = Array.isArray(order?.order_items) ? order.order_items : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full animate-fade-in">
        {/* Success Header */}
        <div className="text-center mb-8">
          <svg className="mx-auto mb-6 w-20 h-20 text-green-600 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#dcfce7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" stroke="#16a34a" />
          </svg>
          <h1 className="text-3xl font-extrabold text-green-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-green-900 text-lg mb-2">Thank you for your purchase. Your order has been placed successfully and is being processed.</p>
          <p className="text-green-700 font-medium">Order ID: #{orderId}</p>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Order Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="font-bold text-green-600">₹{total}</span>
                </div>
              </div>
            </div>
            {/* Shipping Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Shipping Information</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">{name}</p>
                <p>{address}</p>
                <p>{city}, {state} {pin}</p>
                <p>{country}</p>
                <p>{phone}</p>
                <p>{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Products */}
        {items.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Purchased Products</h2>
            <div className="space-y-4">
              {items.map((item, index) => {
                // Try to get product image from item.product.images if available
                let imageUrl = '/images/placeholder-product.jpg';
                if (item.product && item.product.images) {
                  try {
                    const parsedImages = Array.isArray(item.product.images) ? item.product.images : JSON.parse(item.product.images);
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                      imageUrl = `/storage/${parsedImages[0].replace(/\\/g, '')}`;
                    }
                  } catch (e) {}
                }
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <img 
                        src={imageUrl} 
                        alt={item.product_name || 'Product'} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.product_name || 'Product Name'}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-500">Price: ₹{Number(item.price).toFixed(2)}</span>
                        <span className="font-semibold text-green-600">Total: ₹{(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-col gap-3 mb-6 p-4 bg-green-50 rounded-lg">
          <span className="inline-flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Eco-friendly packaging
          </span>
          <span className="inline-flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Fast & reliable delivery
          </span>
          <span className="inline-flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Thank you for choosing EnvoEarth!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link 
              href="/" 
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-green-800 transition duration-200"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/orders" 
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-700 transition duration-200"
            >
              View Orders
            </Link>
          </div>
          {/* Countdown Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                You will be redirected automatically in 
                <span className="font-bold text-orange-600 mx-1 text-lg">{countdown}</span> 
                second{countdown !== 1 ? 's' : ''}.
              </span>
            </p>
          </div>
          <p className="mt-3 text-sm text-green-600 font-medium">
            📧 You will receive a confirmation email soon.
          </p>
        </div>
      </div>
    </div>
  );
}
