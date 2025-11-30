import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Helper format tiền tệ
const formatVND = (n) => {
  if (n == null) return '0 ₫';
  return Number(n).toLocaleString('vi-VN') + ' ₫';
};

export default function AdminDashboard({
  todayRevenue = 0,
  monthRevenue = 0,
  yearRevenue = 0,
  totalOrders = 0,
  totalProducts = 0,
  topProducts = [],
  lowStock = [], // Dữ liệu tồn kho
  staffPerformance = [],
  shiftsSummary = [],
}) {

  return (
    <AdminLayout>
      <Head title="Trang Quản Lý" />

      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-800">📊 Tổng Quan Kinh Doanh</h1>
          <p className="text-sm text-gray-500">Báo cáo tình hình hoạt động của cửa hàng.</p>
        </header>

        {/* 1. THẺ CHỈ SỐ (KPI CARDS) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 uppercase">Hôm nay</div>
            <div className="text-2xl font-bold text-green-600 mt-2">{formatVND(todayRevenue)}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 uppercase">Tháng này</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{formatVND(monthRevenue)}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 uppercase">Năm nay</div>
            <div className="text-2xl font-bold text-indigo-600 mt-2">{formatVND(yearRevenue)}</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 uppercase">Tổng đơn</div>
            <div className="flex justify-between items-end mt-2">
                <div className="text-2xl font-bold text-gray-800">{totalOrders}</div>
                <div className="text-xs text-gray-400">SP: {totalProducts}</div>
            </div>
          </div>
        </section>

        {/* 2. TOP SẢN PHẨM & TỒN KHO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Sản Phẩm */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Top Sản Phẩm Bán Chạy</h2>
            <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 bg-gray-50 uppercase text-xs">
                        <tr>
                            <th className="px-3 py-2">Tên SP</th>
                            <th className="px-3 py-2 text-right">Đã bán</th>
                            <th className="px-3 py-2 text-right">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-4 text-gray-500">Chưa có dữ liệu</td></tr>
                        ) : (
                            topProducts.map((p, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-3 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-3 py-3 text-right">{p.total_sold}</td>
                                    <td className="px-3 py-3 text-right font-semibold text-blue-600">{formatVND(p.revenue)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>

          {/* ✨ CẢNH BÁO TỒN KHO (LOW STOCK) ✨ */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
            <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                ⚠️ Cảnh Báo Sắp Hết Hàng 
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Stock &lt; 10</span>
            </h2>
            <div className="overflow-y-auto max-h-[300px]">
                {lowStock.length === 0 ? (
                    <div className="text-center py-8 text-green-600 font-medium">
                        ✅ Tất cả sản phẩm đều đủ hàng!
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 bg-red-50 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2">Tên Sản Phẩm</th>
                                <th className="px-3 py-2 text-right">Giá bán</th>
                                <th className="px-3 py-2 text-center">Tồn kho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map((p) => (
                                <tr key={p.id} className="border-b last:border-0 hover:bg-red-50/50">
                                    <td className="px-3 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-3 py-3 text-right text-gray-500">{formatVND(p.price)}</td>
                                    <td className="px-3 py-3 text-center">
                                        <span className={`font-bold px-2 py-1 rounded ${p.stock === 0 ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
          </div>
        </section>

        {/* 3. NHÂN VIÊN & CA LÀM */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiệu suất nhân viên */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🌟 Hiệu Suất Nhân Viên</h3>
                <ul className="space-y-4">
                    {staffPerformance.map((s, idx) => (
                        <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                    {s.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">{s.name}</div>
                                    <div className="text-xs text-gray-500">{s.orders_count} đơn hàng</div>
                                </div>
                            </div>
                            <div className="font-bold text-blue-600">{formatVND(s.revenue)}</div>
                        </li>
                    ))}
                    {staffPerformance.length === 0 && <p className="text-gray-500 text-center">Chưa có dữ liệu</p>}
                </ul>
            </div>

            {/* Ca làm việc gần nhất */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4">⏱ Ca Làm Việc Gần Nhất</h3>
                <div className="space-y-3">
                    {shiftsSummary.map((sh) => (
                        <div key={sh.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <div>
                                <div className="font-medium text-gray-800">{sh.user_name || '---'}</div>
                                <div className="text-xs text-gray-500">
                                    {new Date(sh.start_time).toLocaleDateString('vi-VN')} 
                                    {!sh.end_time && <span className="ml-2 text-green-600 font-bold">(Đang mở)</span>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-700">{formatVND(sh.total_revenue)}</div>
                                <div className={`text-xs font-bold ${Number(sh.difference) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    Lệch: {formatVND(sh.difference)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {shiftsSummary.length === 0 && <p className="text-gray-500 text-center">Chưa có dữ liệu ca làm</p>}
                </div>
            </div>
        </section>

      </div>
    </AdminLayout>
  );
}