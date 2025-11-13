import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function CreateUser() {
    // --- LOGIC GỐC (KHÔNG THAY ĐỔI) ---
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/create-user', form); // <--- Giữ nguyên logic gốc
    };
    // --- KẾT THÚC LOGIC GỐC ---


    // --- GIAO DIỆN MỚI ---
    return (
        // Nền xám nhạt và đảm bảo full-height
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Head title="Tạo nhân viên" />

            {/* Container (Card) mới, responsive hơn */}
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    🧑‍💼 Tạo tài khoản mới
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Trường Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Trường Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Trường Mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Trường Vai trò */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">Nhân viên</option>
                            <option value="admin">Quản lý</option>
                        </select>
                    </div>

                    {/* Nút Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg
                                   transition duration-150 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
                    >
                        Tạo tài khoản
                    </button>
                </form>
            </div>
        </div>
    );
}