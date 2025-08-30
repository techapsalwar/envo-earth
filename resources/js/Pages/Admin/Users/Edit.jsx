import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditUser({ user }) {
    const [data, setData] = useState({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(`/admin/users/${user.id}`, data, {
            onSuccess: () => {
                // Success handled by redirect
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    return (
        <AdminLayout title="Edit User">
            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Users
                </Link>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit User</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Update user information. Leave password fields empty to keep current password.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData({...data, name: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="col-span-6 sm:col-span-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData({...data, email: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData({...data, password: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Leave empty to keep current password"
                                        />
                                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData({...data, password_confirmation: e.target.value})}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.password_confirmation && <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>}
                                    </div>

                                    <div className="col-span-6">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="is_admin"
                                                    name="is_admin"
                                                    type="checkbox"
                                                    checked={data.is_admin}
                                                    onChange={(e) => setData({...data, is_admin: e.target.checked})}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="is_admin" className="font-medium text-gray-700">
                                                    Admin User
                                                </label>
                                                <p className="text-gray-500">
                                                    Give this user admin privileges to access the admin panel.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update User'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}