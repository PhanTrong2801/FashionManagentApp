import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Customers({ customers, search }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        phone: "",
        address: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sales.customers.store"), {
            onSuccess: () => {
                alert("Đã thêm khách hàng thành công!");
                reset();
                setShowModal(false);
            }
        });
    };

    const handleSearch = (e) => {
        router.get("/sales/customers", { search: e.target.value }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Khách hàng" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">👥 Quản lý khách hàng</h1>

                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Tìm khách hàng theo tên hoặc số điện thoại..."
                        defaultValue={search}
                        onChange={handleSearch}
                        className="border rounded px-3 py-2 w-1/2"
                    />

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ➕ Thêm khách hàng
                    </button>
                </div>

                <div className="bg-white shadow rounded p-4">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Tên</th>
                                <th className="border p-2">SĐT</th>
                                <th className="border p-2">Địa chỉ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-3 text-gray-500">
                                        Không có khách hàng nào
                                    </td>
                                </tr>
                            ) : (
                                customers.map((c) => (
                                    <tr key={c.id}>
                                        <td className="border p-2">{c.name}</td>
                                        <td className="border p-2">{c.phone}</td>
                                        <td className="border p-2">{c.address}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal thêm khách hàng */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm khách hàng</h2>

                        <form onSubmit={handleSubmit}>
                            <label className="font-semibold">Tên</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full mb-3"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />

                            <label className="font-semibold">Số điện thoại</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full mb-3"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                required
                            />

                            <label className="font-semibold">Địa chỉ</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full mb-4"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-400 text-white py-2 rounded"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    Hoàn tất
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
