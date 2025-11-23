import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// Hàm helper để định dạng tiền tệ
const formatCurrency = (amount) => {
    const num = Math.round(amount || 0);
    return num.toLocaleString('vi-VN') + '₫';
};

// Hàm trả về icon cho phương thức thanh toán
const getPaymentMethodIcon = (method) => {
    switch (method) {
        case "cash":
            return "💵 Tiền mặt";
        case "card":
            return "💳 Thẻ";
        case "bank":
            return "🏦 Chuyển khoản";
        default:
            return method;
    }
};


export default function CustomerHistory({ customer, invoices }) {
   
    return (
        <AuthenticatedLayout>
            <Head title={"Lịch sử mua hàng – " + customer.name} />

            <div className="min-h-screen bg-gray-50 p-6">
                
              
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-3xl font-extrabold text-blue-800">
                        🧾 LỊCH SỬ MUA HÀNG
                    </h1>
                    <div className='flex gap-3 text-sm'>
                        
                        <Link
                            href={route('sales.customers')}
                            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                        >
                            ← Quay lại Khách hàng
                        </Link>
                    </div>
                </div>

                
                <div className="mb-6 p-4 bg-white rounded-xl shadow-md border-l-4 border-purple-600">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Khách hàng: <span className="text-purple-700">{customer.name}</span>
                    </h2>
                    <p className="text-sm text-gray-600">
                        SĐT: {customer.phone} | Địa chỉ: {customer.address}
                    </p>
                    
                    <p className="text-sm font-medium text-green-700 mt-1">
                        Điểm tích lũy: {customer.points || 0} (Hạng: {customer.rank || "Member"})
                    </p>
                </div>


                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-white shadow-md">
                                <th className="p-4 w-1/12 text-center">ID HĐ</th>
                                <th className="p-4 w-1/6 text-center">Ngày Mua</th>
                                <th className="p-4 w-1/6 text-center">Tổng Tiền</th>
                                <th className="p-4 w-1/6 text-center">P.Thức TT</th>
                                <th className="p-4 w-5/12">Chi tiết sản phẩm</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500 text-lg">
                                        Khách hàng chưa có lịch sử mua hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice, index) => (
                                    <tr 
                                        key={invoice.id}
                                        className={`hover:bg-blue-50 transition ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
                                    >
                                        {/* Hiển thị ID hóa đơn */}
                                        <td className="p-4 text-center font-semibold text-gray-700">
                                            {invoice.invoice_code.toString()}
                                        </td>
                                        {/*  Định dạng ngày mua */}
                                        <td className="p-4 text-center text-sm text-gray-600">
                                            {new Date(invoice.created_at).toLocaleString('vi-VN')}
                                        </td>
                                        {/*  Định dạng tổng tiền */}
                                        <td className="p-4 text-center font-bold text-red-600">
                                            {formatCurrency(invoice.total_amount)}
                                        </td>
                                        {/* Hiển thị phương thức thanh toán */}
                                        <td className="p-4 text-center text-sm font-medium text-gray-800">
                                            {getPaymentMethodIcon(invoice.payment_method)}
                                        </td>
                                        {/*  Hiển thị chi tiết sản phẩm (details/summary) */}
                                        <td className="p-4">
                                            <details className="cursor-pointer bg-gray-200 p-2 rounded-lg text-sm transition open:bg-gray-100">
                                                <summary className="font-semibold text-blue-600 hover:text-blue-700">
                                                    Chi tiết ({invoice.items.length} SP)
                                                </summary>
                                                <div className="mt-2 pt-2 border-t border-gray-300 space-y-1">
                                                    {invoice.items.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex justify-between text-gray-700">
                                                            <span className="truncate flex-1 pr-2">
                                                                {item.product?.name || 'Sản phẩm không rõ'}
                                                            </span>
                                                            <span className="whitespace-nowrap font-medium">
                                                                x {item.quantity} ({formatCurrency(item.price * item.quantity)})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}