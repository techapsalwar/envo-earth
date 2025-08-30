// File: resources/js/Pages/Checkout/Index.jsx
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast } from '@/Components/GlobalToastProvider';
import axios from 'axios';

export default function CheckoutIndex({ cartItems, auth }) {
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        address: '',
        pin: '',
        city: '',
        state: '',
        country: 'India',
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // If user is logged in, prefill address info
        if (auth?.user) {
            setForm(prev => ({
                ...prev,
                address: auth.user.address || '',
                pin: auth.user.pin || '',
                city: auth.user.city || '',
                state: auth.user.state || '',
                country: auth.user.country || 'India',
            }));
        }
    }, [auth]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!form.name.trim()) newErrors.name = 'Name is required';
            if (!form.email.trim()) newErrors.email = 'Email is required';
            if (!form.phone.trim()) newErrors.phone = 'Phone is required';
            if (!auth?.user && !form.password) newErrors.password = 'Password is required';
        }
        
        if (step === 2) {
            if (!form.address.trim()) newErrors.address = 'Address is required';
            if (!form.pin.trim()) newErrors.pin = 'PIN code is required';
            if (form.pin && form.pin.length !== 6) newErrors.pin = 'PIN code must be 6 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateStep(2)) return;
        
        setSubmitting(true);
        try {
            await router.post('/checkout', form, {
                preserveScroll: true,
                onSuccess: () => showToast('Order placed successfully! 🎉', 'success'),
                onError: (errors) => {
                    setErrors(errors);
                    showToast('Please check the form for errors', 'error');
                },
            });
        } finally {
            setSubmitting(false);
        }
    };

    const cartTotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
    // const deliveryFee = cartTotal > 500 ? 0 : 40;
    // const finalTotal = cartTotal + deliveryFee;
    // Remove delivery fee, only cart total is used
    const deliveryFee = 0;
    const finalTotal = cartTotal;

    // If user is not logged in, show login/signup prompt
    if (!auth?.user) {
        return (
            <MainLayout>
                <Head title="Quick Checkout" />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
                    <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold mb-4">Sign in to continue</h2>
                        <p className="mb-6 text-gray-600">You need to log in or create an account to proceed to checkout.</p>
                        <div className="flex flex-col gap-4">
                            <a href="/login" className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">Log In</a>
                            <a href="/register" className="border border-green-600 text-green-700 py-2 rounded font-semibold hover:bg-green-50 transition">Sign Up</a>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Quick Checkout" />
            <div className="min-h-screen bg-gray-50 py-4">
                <div className="container mx-auto max-w-4xl px-4">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                    1
                                </div>
                                <span className="ml-2 hidden sm:block">Contact</span>
                            </div>
                            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                    2
                                </div>
                                <span className="ml-2 hidden sm:block">Delivery</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Contact Information */}
                                    {currentStep === 1 && (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                            
                                            <div>
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Full Name *"
                                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="Email Address *"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                    />
                                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                                </div>
                                                <div>
                                                    <input
                                                        name="phone"
                                                        type="tel"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        placeholder="Phone Number *"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                    />
                                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                                </div>
                                            </div>

                                            {!auth?.user && (
                                                <div>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        placeholder="Create Password *"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                                    />
                                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                                    <p className="text-gray-500 text-sm mt-1">We'll create an account for you to track your order</p>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold transition-colors"
                                            >
                                                Continue to Delivery
                                            </button>
                                        </div>
                                    )}

                                    {/* Step 2: Delivery Information */}
                                    {currentStep === 2 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-semibold">Delivery Address</h2>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentStep(1)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
                                                >
                                                    ← Back to Contact
                                                </button>
                                            </div>

                                            <div>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    placeholder="Complete Address (House/Flat No, Street, Area) *"
                                                    rows="3"
                                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <input
                                                        name="pin"
                                                        value={form.pin}
                                                        onChange={handleChange}
                                                        placeholder="PIN Code *"
                                                        maxLength="6"
                                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.pin ? 'border-red-500' : 'border-gray-300'}`}
                                                    />
                                                    {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
                                                </div>
                                                <div>
                                                    <input
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        placeholder="City"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        name="state"
                                                        value={form.state}
                                                        onChange={handleChange}
                                                        placeholder="State"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Placing Order...
                                                    </span>
                                                ) : (
                                                    `Place Order - ₹${finalTotal.toFixed(2)}`
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                {/* Show cart items */}
                                <div className="space-y-3 mb-4">
                                    {cartItems.map(({ product, quantity }) => (
                                        <div key={product.id} className="flex justify-between items-center text-sm">
                                            <div className="flex-1">
                                                <p className="font-medium truncate">{product.name}</p>
                                                <p className="text-gray-500">Qty: {quantity}</p>
                                            </div>
                                            <span className="font-medium">₹{(product.price * quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    {/* Delivery Fee removed */}
                                    {/* <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div> */}
                                    {/* {cartTotal <= 500 && (
                                        <p className="text-xs text-gray-500">
                                            Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery
                                        </p>
                                    )} */}
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span>₹{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Secure
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Fast Delivery
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
