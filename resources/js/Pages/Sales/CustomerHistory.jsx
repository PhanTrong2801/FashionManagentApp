import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CustomerHistory({ customer, invoices }) {
    return (
        <AuthenticatedLayout>
            <Head title={"Lịch sử mua hàng – " + customer.name} />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    🧾 Lịch sử mua hàng: {customer.name}
                </h1>

                <Link
                    href="/sales/customers"
                    className="text-blue-600 underline mb-4 inline-block"
                >
                    ← Quay lại danh sách khách hàng
                </Link>

                <div className="bg-white shadow rounded p-4">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Mã hóa đơn</th>
                                <th className="border p-2">Ngày</th>
                                <th className="border p-2">Tổng tiền</th>
                                <th className="border p-2">Phương thức</th>
                                <th className="border p-2">Chi tiết</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-3 text-gray-500">
                                        Khách hàng chưa có mua hàng nào
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td className="border p-2 text-center">{invoice.id}</td>
                                        <td className="border p-2 text-center">
                                            {new Date(invoice.created_at).toLocaleString()}
                                        </td>
                                        <td className="border p-2 text-center">
                                            {invoice.total.toLocaleString()} ₫
                                        </td>
                                        <td className="border p-2 text-center">
                                            {invoice.payment_method}
                                        </td>
                                        <td className="border p-2 text-center">
                                            <details className="cursor-pointer">
                                                <summary className="text-blue-600 underline">
                                                    Xem
                                                </summary>
                                                <div className="mt-2">
                                                    {invoice.items.map((item) => (
                                                        <div key={item.id} className="border p-2 mb-1">
                                                            {item.product?.name} — SL: {item.quantity} — 
                                                            Giá: {item.price.toLocaleString()} ₫
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
