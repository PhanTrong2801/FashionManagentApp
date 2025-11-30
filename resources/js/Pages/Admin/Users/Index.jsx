import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function UserIndex({ users }) {
    
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Quản lý nhân viên" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">👥 Danh Sách Nhân Viên</h1>
                <Link 
                    href={route('admin.users.create')} 
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + Thêm nhân viên
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Tên hiển thị</th>
                            <th className="p-4">Email (Tài khoản)</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.data.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{user.id}</td>
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    {user.role === 'admin' ? (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Admin</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Nhân viên</span>
                                    )}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link 
                                        href={route('admin.users.edit', user.id)} 
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sửa
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:underline ml-2"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination links */}
                <div className="p-4">
                   {/* Bạn có thể copy component Pagination từ các trang trước vào đây */}
                </div>
            </div>
        </AdminLayout>
    );
}