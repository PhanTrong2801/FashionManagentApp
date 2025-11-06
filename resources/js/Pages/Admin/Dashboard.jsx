import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({
    todayRevenue,
    monthRevenue,
    totalOrders,
    totalProducts,
    topProducts,
    lowStock,
}) {
    return (
        <div className="p-6">
            <Head title="Trang Quản Lý" />
            <h1 className="text-3xl font-bold mb-6">👑 Trang Quản Lý Bán Hàng</h1>

            {/* --- Tổng quan doanh thu --- */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500 text-sm">Doanh thu hôm nay</h2>
                    <p className="text-2xl font-bold text-green-600">
                        {todayRevenue.toLocaleString()} ₫
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500 text-sm">Doanh thu tháng</h2>
                    <p className="text-2xl font-bold text-blue-600">
                        {monthRevenue.toLocaleString()} ₫
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500 text-sm">Tổng đơn hàng</h2>
                    <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500 text-sm">Tổng sản phẩm</h2>
                    <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                </div>
            </div>

            {/* --- Top sản phẩm bán chạy --- */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-xl font-semibold mb-3">🏆 Top 5 sản phẩm bán chạy</h2>
                <table className="w-full border">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">Tên sản phẩm</th>
                            <th className="p-2">Đã bán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((item, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.total_sold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Sản phẩm gần hết hàng --- */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-3">⚠️ Sản phẩm sắp hết hàng</h2>
                {lowStock.length > 0 ? (
                    <table className="w-full border">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-2">Tên sản phẩm</th>
                                <th className="p-2">Tồn kho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2 text-red-600 font-semibold">{p.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-green-600 font-semibold">Tất cả sản phẩm đều đủ hàng.</p>
                )}
            </div>
        </div>
    );
}