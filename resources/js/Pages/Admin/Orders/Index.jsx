import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// --- HELPERS ---
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const formatDateTime = (d) => new Date(d).toLocaleString('vi-VN');

// --- MODAL CHI TIẾT ĐƠN HÀNG ---
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Chi tiết đơn hàng #{order.invoice_code || order.id}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">&times;</button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <p className="text-gray-500">Khách hàng:</p>
                            <p className="font-bold">{order.customer?.name || 'Khách lẻ'}</p>
                            <p>{order.customer?.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Ngày tạo:</p>
                            <p className="font-bold">{formatDateTime(order.created_at)}</p>
                            <p className="text-gray-500">Nhân viên: {order.user?.name}</p>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse text-sm mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Sản phẩm</th>
                                <th className="p-2 border text-center">SL</th>
                                <th className="p-2 border text-right">Đơn giá</th>
                                <th className="p-2 border text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 border">{item.product?.name || 'SP đã xóa'}</td>
                                    <td className="p-2 border text-center">{item.quantity}</td>
                                    <td className="p-2 border text-right">{formatCurrency(item.price)}</td>
                                    <td className="p-2 border text-right">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end text-lg font-bold text-red-600">
                        Tổng cộng: {formatCurrency(order.total_amount)}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Đóng</button>
                </div>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
export default function OrderIndex({ orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSearch = () => {
        router.get(route('admin.orders.index'), { search, date }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Quản lý Hóa đơn" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">🧾 Danh Sách Hóa Đơn</h1>
                
                {/* Bộ lọc */}
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="date" 
                        className="border rounded px-3 py-2 text-sm"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Tìm mã đơn, tên khách..." 
                        className="border rounded px-3 py-2 text-sm flex-1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Lọc</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Mã HĐ</th>
                            <th className="p-4">Ngày tạo</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4 text-center">TT</th>
                            <th className="p-4 text-right">Tổng tiền</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {orders.data.length === 0 ? (
                            <tr><td colSpan="7" className="p-6 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
                        ) : (
                            orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="p-4 font-bold text-blue-600">
                                        {order.invoice_code || `#${order.id}`}
                                    </td>
                                    <td className="p-4 text-gray-600">{formatDateTime(order.created_at)}</td>
                                    <td className="p-4">
                                        {order.customer ? (
                                            <div>
                                                <div className="font-medium">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                            </div>
                                        ) : <span className="text-gray-400 italic">Khách lẻ</span>}
                                    </td>
                                    <td className="p-4 text-gray-700">{order.user?.name}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${order.payment_method === 'bank' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-red-600">
                                        {formatCurrency(order.total_amount)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-blue-600 hover:underline">Xem</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Pagination */}
                <div className="p-4 border-t flex justify-center gap-1">
                    {orders.links.map((link, i) => (
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

            {/* Modal Chi tiết */}
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </AdminLayout>
    );
}