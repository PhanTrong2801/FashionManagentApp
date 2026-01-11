import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function ReportIndex({ chartData, summary, filters }) {
    const [month, setMonth] = useState(filters.month);
    const [year, setYear] = useState(filters.year);

    const handleFilter = () => {
        router.get(route('admin.reports.index'), { month, year }, { preserveState: true });
    };

    const handleExport = () => {
        // Chuyển hướng trình duyệt để tải file (không dùng Inertia router vì đây là download)
        window.location.href = route('admin.reports.export', { month, year });
    };

    return (
        <AdminLayout>
            <Head title="Báo cáo Doanh thu" />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">📊 Báo Cáo Doanh Thu</h1>
                
                {/* Bộ lọc & Nút Xuất */}
                <div className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm border">
                    <select value={month} onChange={e => setMonth(e.target.value)} className="border-gray-300 rounded text-sm py-1.5">
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                        ))}
                    </select>
                    <select value={year} onChange={e => setYear(e.target.value)} className="border-gray-300 rounded text-sm py-1.5">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                    <button onClick={handleFilter} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200 border">
                        Xem
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button onClick={handleExport} className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm">
                        <span>📥 Xuất Excel</span>
                    </button>
                </div>
            </div>

            {/* Tổng quan  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm uppercase font-bold">Tổng doanh thu (Tháng {month})</p>
                    <p className="text-3xl font-extrabold text-blue-700 mt-2">{formatVND(summary.revenue)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
                    <p className="text-gray-500 text-sm uppercase font-bold">Tổng đơn hàng</p>
                    <p className="text-3xl font-extrabold text-orange-700 mt-2">{summary.orders} đơn</p>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700 mb-6">Biểu đồ biến động theo ngày</h3>
                
                <div className="h-[400px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : `${val/1000}k`} />
                                <Tooltip formatter={(value) => formatVND(value)} />
                                <Legend />
                                <Bar dataKey="total" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                            Chưa có dữ liệu doanh thu cho tháng này.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}