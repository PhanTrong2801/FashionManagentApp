import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";



// Hàm helper để định dạng tiền tệ
const formatCurrency = (amount) => {
    const num = Math.round(amount || 0);
    return num.toLocaleString('vi-VN') + '₫';
};

// Hàm định dạng ngày giờ (sử dụng Date object)
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
};

// Hàm trả về icon cho phương thức thanh toán (Thêm lại logic này)
const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
        case "cash":
            return "💵 Tiền mặt";
        case "card":
            return "💳 Thẻ/POS";
        case "bank":
            return "🏦 Chuyển khoản";
        default:
            return method || "N/A";
    }
};

export default function InvoiceHistory({ invoices, filters, auth, users }) {

 
    const today = new Date().toISOString().split("T")[0];

    const [day, setDay] = useState(filters.day || today);
    const [userId, setUserId] = useState(filters.user_id || auth.user.id);
    

    function applyFilter() {
        // LOGIC GIỮ NGUYÊN
        router.get("/sales/invoices", { 
            day,
            user_id: userId
        });
    }

    function clearFilter() {
        // LOGIC GIỮ NGUYÊN
        setDay(today);
        setUserId(auth.user.id);
        router.get("/sales/invoices");
    }

    return (
        <AuthenticatedLayout>
            <Head title="Lịch sử hóa đơn" />

            <div className="min-h-screen bg-gray-50 p-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-3xl font-extrabold text-blue-800">
                        📜 LỊCH SỬ HÓA ĐƠN BÁN HÀNG
                    </h1>
                    <div className='flex gap-3 text-sm'>
                        <Link
                            href={route('sales.dashboard')} 
                            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                        >
                            🛒 Quay lại Bán hàng
                        </Link>
                    </div>
                </div>

                {/* BỘ LỌC */}
                <div className="mb-6 p-4 bg-white rounded-xl shadow-md flex items-center gap-4 border-l-4 border-blue-600">

                    {/* Hiển thị tên nhân viên */}
                    <div className="font-bold text-lg text-blue-700 flex-shrink-0">
                        Nhân viên: <span className="text-gray-800">{auth.user.name}</span>
                    </div>

                    <span className="text-gray-400">|</span>
                    
                    {/* Lọc theo ngày */}
                    <div className="flex items-center gap-2">
                        <label className="font-semibold text-gray-700">Ngày:</label>
                        <input
                            type="date"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        onClick={applyFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Lọc
                    </button>

                    <button
                        onClick={clearFilter}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                    >
                        Xóa lọc
                    </button>
                </div>

                {/* DANH SÁCH HÓA ĐƠN */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-white shadow-md">
                                {/* ĐIỀU CHỈNH ĐỘ RỘNG CỘT */}
                                <th className="p-4 w-[8%] text-center">Mã HĐ</th>
                                <th className="p-4 w-[12%] text-center">Ngày tạo</th>
                                <th className="p-4 w-[12%] text-center">Nhân viên</th>
                                <th className="p-4 w-[15%] text-center">Phương thức TT</th> 
                                <th className="p-4 w-[38%]">Chi tiết Sản phẩm</th> 
                                <th className="p-4 w-[15%] text-center">Tổng tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500 text-lg">
                                        Không có hóa đơn nào được tìm thấy.
                                    </td>
                                </tr>
                            )}

                            {invoices.map((invoice, index) => (
                                <tr 
                                    key={invoice.id} 
                                    className={`hover:bg-blue-50 transition ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
                                >
                                    <td className="p-4 text-center font-bold text-gray-700 text-sm">
                                        #{invoice.id.toString().slice(-6)}
                                    </td>

                                    <td className="p-4 text-center text-sm text-gray-600">
                                        {formatDateTime(invoice.created_at)}
                                    </td>

                                    <td className="p-4 text-sm font-semibold text-gray-700">
                                        {invoice.user?.name || "Không xác định"}
                                    </td>

                                    
                                    <td className="p-4 text-center text-sm font-medium">
                                        {getPaymentMethodIcon(invoice.payment_method)}
                                    </td>
                                    
                                    {/* CỘT CHI TIẾT SẢN PHẨM */}
                                    <td className="p-4 text-sm">
                                        <details className="cursor-pointer bg-gray-200 p-2 rounded-lg text-xs transition open:bg-gray-100">
                                            <summary className="font-semibold text-blue-600 hover:text-blue-700">
                                                Xem chi tiết ({invoice.items.length} SP)
                                            </summary>
                                            <div className="mt-2 pt-2 border-t border-gray-300 space-y-1">
                                                {invoice.items.map((i) => (
                                                    <div key={i.id} className="flex justify-between text-gray-700">
                                                        <span className="truncate pr-2">- {i.product?.name || 'Sản phẩm không rõ'}</span>
                                                        <span className="font-medium text-gray-600 whitespace-nowrap">
                                                            x {i.quantity} 
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </td>
                                    


                                    <td className="p-4 text-center text-red-600 font-bold text-lg">
                                        {formatCurrency(invoice.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}