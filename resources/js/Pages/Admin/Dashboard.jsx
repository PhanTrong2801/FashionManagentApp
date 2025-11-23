// Asset (uploaded file) path: /mnt/data/39b13366-119f-4efe-8de8-130b4b685fe5.png
import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';

// Small helper to format numbers as VND currency
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
  lowStock = [],
  staffPerformance = [],
  shiftsSummary = [],
}) {
  return (
    
        <AdminLayout>
      <Head title="Trang Quản Lý" />

      <div className="p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">👑 Trang Quản Lý Bán Hàng</h1>
          <div className="text-sm text-gray-600">Admin dashboard</div>
        </header>

        {/* Overview cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">Doanh thu hôm nay</div>
            <div className="text-2xl font-bold text-green-600 mt-2">{formatVND(todayRevenue)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">Doanh thu tháng</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{formatVND(monthRevenue)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">Doanh thu năm</div>
            <div className="text-2xl font-bold text-indigo-600 mt-2">{formatVND(yearRevenue)}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-gray-800 mt-2">{totalOrders}</div>
            <div className="text-sm text-gray-500 mt-1">Sản phẩm: {totalProducts}</div>
          </div>
        </section>

        {/* Middle row: charts placeholders + top products */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Doanh thu (30 ngày)</h2>
            {/* Placeholder chart — replace with chart library if desired */}
            <div className="h-48 bg-gradient-to-r from-blue-50 to-green-50 rounded p-3 flex items-end gap-2">
              {/* simple bars from topProducts data for visual */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 h-full flex items-end justify-center">
                  <div style={{ height: `${20 + i * 6}%` }} className="w-5 bg-blue-500 rounded-t" />
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-500">Biểu đồ tạm — tích hợp Recharts / Chart.js khi cần</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">🏆 Top sản phẩm bán chạy</h2>
            <ul className="space-y-2">
              {topProducts.length === 0 ? (
                <li className="text-gray-500">Chưa có dữ liệu</li>
              ) : (
                topProducts.map((p) => (
                  <li key={p.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">Doanh thu: {formatVND(p.revenue || p.total_sold_amount || 0)}</div>
                    </div>
                    <div className="text-sm font-semibold">{p.total_sold ?? p.total_sold}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Low stock and shifts / staff performance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">⚠️ Sản phẩm gần hết hàng</h3>
            {lowStock.length === 0 ? (
              <div className="text-green-600 font-medium">Tất cả sản phẩm đều đủ hàng.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="pb-2">Sản phẩm</th>
                    <th className="pb-2 text-right">Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2 text-right text-red-600 font-semibold">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">📊 Hiệu suất nhân viên (tháng)</h3>
            {staffPerformance.length === 0 ? (
              <div className="text-gray-500">Chưa có dữ liệu nhân viên</div>
            ) : (
              <ul className="space-y-3 text-sm">
                {staffPerformance.map((s) => (
                  <li key={s.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">Đơn: {s.orders_count}</div>
                    </div>
                    <div className="font-semibold">{formatVND(s.revenue)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-3">⏱ Ca làm gần nhất</h3>
            {shiftsSummary.length === 0 ? (
              <div className="text-gray-500">Không có ca</div>
            ) : (
              <ul className="text-sm space-y-2">
                {shiftsSummary.map((sh) => (
                  <li key={sh.id} className="border rounded p-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{sh.user?.name || '—'}</div>
                        <div className="text-xs text-gray-500">{sh.start_time} → {sh.end_time || 'đang chạy'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatVND(sh.total_revenue ?? 0)}</div>
                        <div className="text-xs text-gray-500">Chênh lệch: {formatVND(sh.difference ?? 0)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Footer: quick actions */}
        <section className="flex flex-col md:flex-row gap-3 md:gap-6">
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold mb-2">Hành động nhanh</h4>
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Xuất báo cáo</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded">Nhập kho</button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded">Quản lý nhân viên</button>
            </div>
          </div>

          <div className="w-96 bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold mb-2">Tài nguyên</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div>- Hướng dẫn xuất báo cáo (PDF / Excel)</div>
              <div>- Quản lý vai trò và phân quyền</div>
              <div>- Cấu hình cửa hàng</div>
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
    
  );
}
