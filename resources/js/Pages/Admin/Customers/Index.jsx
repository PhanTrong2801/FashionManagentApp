import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CustomerIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('admin.customers.index'), { search }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Quản lý Khách hàng" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">👥 Danh Sách Khách Hàng</h1>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Tìm tên hoặc SĐT..." 
                        className="border rounded px-3 py-2 text-sm w-64"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tìm</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Tên Khách hàng</th>
                            <th className="p-4">Số điện thoại</th>
                            <th className="p-4">Địa chỉ</th>
                            <th className="p-4 text-center">Hạng</th>
                            <th className="p-4 text-center">Điểm tích lũy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {customers.data.map(customer => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{customer.name}</td>
                                <td className="p-4 text-blue-600">{customer.phone}</td>
                                <td className="p-4 text-gray-500">{customer.address || '---'}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${customer.rank === 'Diamond' ? 'bg-purple-100 text-purple-700' : 
                                          customer.rank === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {customer.rank || 'Member'}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-bold text-green-600">{customer.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
            <div className="p-4 border-t flex justify-center gap-1">
                {customers.links.map((link, i) => (
                    link.url ? (
                        // Trường hợp có link: Dùng thẻ Link để chuyển trang
                        <Link
                            key={i}
                            href={link.url}
                            className={`px-3 py-1 border rounded text-sm ${
                                link.active 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        // Trường hợp url là null (Nút Previous/Next bị disable): Dùng thẻ span
                        <span
                            key={i}
                            className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
            </div>
        </AdminLayout>
    );
}