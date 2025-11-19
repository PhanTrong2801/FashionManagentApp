import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function InvoiceHistoy({ invoices, filters }) {

    const [day, setDay] = useState(filters.day || "");

    function applyFilter() {
        router.get("/sales/invoices", { day });
    }

    function clearFilter() {
        setDay("");
        router.get("/sales/invoices");
    }

    return (
        <div className="p-6">
            <AuthenticatedLayout>
                <h1 className="text-2xl font-bold mb-4">Lịch sử hóa đơn</h1>

                {/* Bộ lọc theo ngày */}
                <div className="bg-white p-4 rounded shadow mb-5 flex items-center gap-3">
                    <div>
                        <label className="font-semibold">Theo ngày:</label>
                        <input
                            type="date"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="border p-2 rounded ml-2"
                        />
                    </div>

                    <button
                        onClick={applyFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Lọc
                    </button>

                    <button
                        onClick={clearFilter}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Xóa lọc
                    </button>
                </div>

                {/* Danh sách hóa đơn */}
                <div className="bg-white rounded shadow p-4">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100 border">
                                <th className="p-2 border">Mã HĐ</th>
                                <th className="p-2 border">Ngày tạo</th>
                                <th className="p-2 border">Sản phẩm</th>
                                <th className="p-2 border">Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-3 text-gray-500">
                                        Không có hóa đơn nào
                                    </td>
                                </tr>
                            )}

                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="border">
                                    <td className="p-2 border">{invoice.id}</td>
                                    <td className="p-2 border">
                                        {new Date(invoice.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-2 border">
                                        {invoice.items.map((i) => (
                                            <div key={i.id}>
                                                - {i.product.name} x {i.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-2 border text-red-600 font-bold">
                                        {invoice.total.toLocaleString()} đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </AuthenticatedLayout>
        </div>
    );
}
