import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Helper format tiền
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Helper format ngày giờ
const formatDateTime = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
};

export default function ShiftIndex({ shifts }) {
    return (
        <AdminLayout>
            <Head title="Lịch sử Ca làm việc" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⏳ Lịch Sử Ca Làm Việc</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4">Thời gian</th>
                            <th className="p-4 text-right">Vốn đầu ca</th>
                            <th className="p-4 text-right">Tổng Doanh thu</th>
                            <th className="p-4 text-right text-indigo-700">Chuyển khoản</th> 
                            
                            {/* ✨ ĐÃ SỬA TÊN CỘT TẠI ĐÂY ✨ */}
                            <th className="p-4 text-right">Tiền mặt</th>

                            <th className="p-4 text-right">Chênh lệch</th>
                            <th className="p-4 text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {shifts.data.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="p-6 text-center text-gray-500">Chưa có dữ liệu ca làm việc.</td>
                            </tr>
                        ) : (
                            shifts.data.map((shift) => (
                                <tr key={shift.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 text-gray-500">#{shift.id}</td>
                                    
                                    <td className="p-4 font-medium text-gray-800">
                                        {shift.user?.name || <span className="italic text-gray-400">Đã xóa</span>}
                                    </td>

                                    <td className="p-4">
                                        <div className="text-green-600">Mở: {formatDateTime(shift.start_time)}</div>
                                        {shift.end_time && (
                                            <div className="text-red-500">Đóng: {formatDateTime(shift.end_time)}</div>
                                        )}
                                    </td>

                                    <td className="p-4 text-right font-mono text-gray-600">
                                        {formatCurrency(shift.opening_cash)}
                                    </td>

                                    <td className="p-4 text-right font-bold text-blue-600">
                                        {formatCurrency(shift.total_revenue)}
                                    </td>

                                    <td className="p-4 text-right font-bold text-indigo-600 bg-indigo-50/50">
                                        {formatCurrency(shift.total_bank)}
                                    </td>

                                    {/* Dữ liệu Tiền mặt (Closing Cash) */}
                                    <td className="p-4 text-right font-mono font-medium">
                                        {shift.end_time ? formatCurrency(shift.closing_cash) : '---'}
                                    </td>

                                    <td className="p-4 text-right">
                                        {shift.end_time ? (
                                            <span className={`font-bold px-2 py-1 rounded ${
                                                Number(shift.difference) < 0 
                                                    ? 'bg-red-100 text-red-700' 
                                                    : (Number(shift.difference) > 0 ? 'bg-yellow-100 text-yellow-700' : 'text-green-600')
                                            }`}>
                                                {formatCurrency(shift.difference)}
                                            </span>
                                        ) : '---'}
                                    </td>

                                    <td className="p-4 text-center">
                                        {shift.end_time ? (
                                            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold">Đã đóng</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold animate-pulse">Đang hoạt động</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {shifts.links && shifts.links.length > 3 && (
                    <div className="p-4 border-t flex justify-center gap-1">
                        {shifts.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 border rounded text-sm ${
                                    link.active 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}