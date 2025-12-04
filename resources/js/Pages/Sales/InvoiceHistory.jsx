import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// ... (Giữ nguyên các hàm helper formatCurrency, formatDateTime...)
const formatCurrency = (amount) => {
    const num = Number(amount) || 0; 
    return num.toLocaleString('vi-VN') + '₫';
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
};

const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
        case "cash": return "💵 Tiền mặt";
        case "card": return "💳 Thẻ/POS";
        case "bank": return "🏦 CK Ngân hàng";
        default: return method || "Khác";
    }
};

export default function InvoiceHistory({ invoices, filters, auth }) {
    
    const today = new Date().toISOString().split("T")[0];
    
    // 1. Thêm state search
    const [day, setDay] = useState(filters.day || today);
    const [search, setSearch] = useState(filters.search || '');

    // 2. Cập nhật hàm lọc để gửi cả search lên server
    function applyFilter() {
        router.get("/sales/invoices", { 
            day,
            search // Gửi thêm biến search
        }, { preserveState: true });
    }

    // 3. Xử lý khi nhấn Enter ở ô tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilter();
        }
    };

    function clearFilter() {
        setDay(today);
        setSearch(''); // Xóa ô tìm kiếm
        router.get("/sales/invoices");
    }

    return (
        <AuthenticatedLayout>
            <Head title="Lịch sử đơn hàng" />

            <div className="min-h-screen bg-gray-50 p-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800">
                        📜 LỊCH SỬ ĐƠN HÀNG
                    </h1>
                    <Link
                        href={route('sales.dashboard')} 
                        className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        ⬅️ Quay lại Bán hàng
                    </Link>
                </div>

                {/* BỘ LỌC */}
                <div className="mb-6 p-4 bg-white rounded-xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-blue-600">
                    <div className="font-bold text-blue-700 whitespace-nowrap">
                        Nhân viên: <span className="text-gray-800">{auth.user.name}</span>
                    </div>

                    <span className="text-gray-300 hidden md:inline">|</span>
                    
                    {/* ✨ Ô TÌM KIẾM MỚI ✨ */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="🔍 Nhập mã hóa đơn..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Lọc theo ngày */}
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700 whitespace-nowrap">Ngày:</label>
                        <input
                            type="date"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={applyFilter} className="bg-blue-600 text-white px-4 py-1.5 rounded shadow hover:bg-blue-700 text-sm font-medium">
                            Tìm / Lọc
                        </button>
                        <button onClick={clearFilter} className="bg-gray-500 text-white px-4 py-1.5 rounded shadow hover:bg-gray-600 text-sm font-medium">
                            Xóa
                        </button>
                    </div>
                </div>

                {/* DANH SÁCH HÓA ĐƠN (Giữ nguyên logic hiển thị) */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-4 text-center">Mã HĐ</th>
                                <th className="p-4 text-center">Thời gian</th>
                                <th className="p-4 text-center">Nhân viên</th>
                                <th className="p-4 text-center">Khách hàng</th>
                                <th className="p-4 text-center">TT</th> 
                                <th className="p-4">Sản phẩm</th> 
                                <th className="p-4 text-right">Tổng tiền</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {invoices.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        Không tìm thấy đơn hàng nào khớp với điều kiện lọc.
                                    </td>
                                </tr>
                            ) : (
                                invoices.data.map((invoice, index) => (
                                    <tr 
                                        key={invoice.id} 
                                        className={`hover:bg-blue-50 transition ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}
                                    >
                                       
                                        <td className="p-4 text-center font-bold text-blue-600 text-sm">
                                            {invoice.invoice_code || `#${invoice.id}`}
                                        </td>
                                        
                                        <td className="p-4 text-center text-sm text-gray-600">
                                            {formatDateTime(invoice.created_at)}
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-gray-800 bg-blue-50/50">
                                        {invoice.user?.name || "N/A"}
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-gray-700">
                                            {invoice.customer ? (
                                                <span className="text-blue-600">{invoice.customer.name}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Khách lẻ</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center text-sm">
                                            {getPaymentMethodIcon(invoice.payment_method)}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <details className="cursor-pointer group">
                                                <summary className="font-semibold text-gray-700 group-hover:text-blue-600 list-none flex items-center gap-1">
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                                        {invoice.items.length} món
                                                    </span>
                                                    <span className="text-xs text-gray-400">▼</span>
                                                </summary>
                                                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs space-y-1">
                                                    {invoice.items.map((i) => (
                                                        <div key={i.id} className="flex justify-between items-center">
                                                            <span className="truncate w-40 text-gray-700">
                                                                {i.product?.name || 'Sản phẩm đã xóa'}
                                                            </span>
                                                            <span className="font-mono text-gray-500">x{i.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        </td>
                                        <td className="p-4 text-right text-red-600 font-bold text-base">
                                            {formatCurrency(invoice.total_amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    
                    {/* PHÂN TRANG */}
                    {invoices.links && invoices.links.length > 3 && (
                        <div className="p-4 border-t flex justify-center gap-1 bg-gray-50">
                            {invoices.links.map((link, key) => (
                                link.url ? (
                                    // Trường hợp có URL: Hiển thị thẻ Link
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm border rounded ${
                                            link.active 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    // Trường hợp URL là null (Trang trước/Trang sau bị disable): Hiển thị thẻ span
                                    <span
                                        key={key}
                                        className="px-3 py-1 text-sm border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}