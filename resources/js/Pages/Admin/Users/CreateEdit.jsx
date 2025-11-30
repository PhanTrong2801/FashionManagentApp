import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateEditUser({ user }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '', // Để trống nếu không muốn đổi pass khi sửa
        role: user?.role || 'user',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? "Sửa nhân viên" : "Thêm nhân viên"} />

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEdit ? `✏️ Cập nhật: ${user.name}` : "✨ Tạo tài khoản mới"}
                </h1>

                <form onSubmit={submit} className="space-y-4">
                    
                    {/* Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (Dùng để đăng nhập)</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {isEdit ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>

                    {/* Vai trò */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                        <select
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">Nhân viên bán hàng (Sales)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                        {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href={route('admin.users.index')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? "Đang lưu..." : "Lưu lại"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}