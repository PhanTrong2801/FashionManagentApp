import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Products() {
    const { products, categories, suppliers } = usePage().props;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [searchProduct, setSearchProduct] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        supplier_id: "",
    });

    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            stock: "",
            category_id: "",
            supplier_id: "",
        });
        setEditing(null);
    };

    const openAdd = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name,
            price: p.price,
            stock: p.stock,
            category_id: p.category_id,
            supplier_id: p.supplier_id || "",
        });
        setShowForm(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(route("admin.products.update", editing.id), form);
        } else {
            router.post(route("admin.products.store"), form);
        }
        resetForm();
        setShowForm(false);
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchProduct.toLowerCase())
    );

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">🛍 Quản lý sản phẩm</h1>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={openAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                >
                    ➕ Thêm sản phẩm
                </button>

                <input
                    placeholder="🔍 Tìm sản phẩm..."
                    className="border p-2 rounded flex-1"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                />
            </div>

            {showForm && (
                <form
                    onSubmit={submit}
                    className="bg-white p-4 shadow rounded mb-6 grid grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        placeholder="Tên sản phẩm"
                        className="border p-2 rounded"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Giá"
                        className="border p-2 rounded"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        placeholder="Tồn kho"
                        className="border p-2 rounded"
                        value={form.stock}
                        onChange={(e) =>
                            setForm({ ...form, stock: e.target.value })
                        }
                    />

                    <select
                        className="border p-2 rounded"
                        value={form.category_id}
                        onChange={(e) =>
                            setForm({ ...form, category_id: e.target.value })
                        }
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select className="border p-2 rounded col-span-2" value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}>
                        <option value="">-- Chọn Nhà cung cấp (Tùy chọn) --</option>
                        {suppliers && suppliers.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <button className="col-span-2 bg-green-600 text-white py-2 rounded shadow">
                        {editing ? "Cập nhật" : "Thêm mới"}
                    </button>
                </form>
            )}

            {/* ================= DANH SÁCH SẢN PHẨM ================= */}
            <div className="bg-white shadow rounded overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="p-2">Tên</th>
                                <th className="p-2">Danh mục</th>
                                <th className="p-3">Nhà cung cấp</th>
                                <th className="p-2">Giá</th>
                                <th className="p-2">Tồn kho</th>
                                <th className="p-2">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2">{p.category?.name}</td>
                                    <td className="p-3 text-sm text-blue-600">
                                        {p.supplier?.name || <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="p-2">
                                        {p.price.toLocaleString()}₫
                                    </td>
                                    <td className="p-2">{p.stock}</td>
                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => openEdit(p)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        "admin.products.destroy",
                                                        p.id
                                                    )
                                                )
                                            }
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= DANH MỤC ================= */}
            <h2 className="text-xl font-bold mt-10 mb-3">
                📂 Danh mục sản phẩm
            </h2>

            <CategoryManager
                categories={categories}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
            />
        </AdminLayout>
    );
}

function CategoryManager({ categories, searchCategory, setSearchCategory }) {
    const [name, setName] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        router.post(route("admin.categories.store"), { name });
        setName("");
    };

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex gap-2 mb-3">
                <input
                    placeholder="🔍 Tìm danh mục..."
                    className="border p-2 rounded flex-1"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                />

                <form onSubmit={submit} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tên danh mục"
                        className="border p-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button className="bg-blue-600 text-white px-4 rounded">
                        Thêm danh mục
                    </button>
                </form>
            </div>

            <div className="max-h-72 overflow-y-auto border rounded">
                <ul>
                    {filtered.map((c) => (
                        <li
                            key={c.id}
                            className="border-b p-2 flex justify-between"
                        >
                            {c.name}
                            <button
                                onClick={() =>
                                    router.delete(
                                        route("admin.categories.destroy", c.id)
                                    )
                                }
                                className="text-red-600"
                            >
                                Xoá
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
