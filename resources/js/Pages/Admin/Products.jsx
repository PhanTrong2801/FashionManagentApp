import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

    // ham chuyen co dau thanh ko dau de tim kiem
    function removeVietnameseTones(str) {
        if (!str) return "";
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); 
        return str.toLowerCase().trim(); 
    }

    export default function Products() {
        const { products, categories, suppliers } = usePage().props;

        const [showForm, setShowForm] = useState(false);
        const [editing, setEditing] = useState(null);

        const [searchProduct, setSearchProduct] = useState("");
        const [searchCategory, setSearchCategory] = useState("");

        const [form, setForm] = useState({
            code: "",
            name: "",
            price: "",
            stock: "",
            category_id: "",
            supplier_id: "",
        });

        const resetForm = () => {
            setForm({
                code: "",
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
                code: p.code || "",
                name: p.name,
                price: p.price,
                stock: p.stock,
                category_id: p.category_id,
                supplier_id: p.supplier_id || "",
            });
            setShowForm(true);
        };

        const submit = (e) => {
            const missingFields = [];
            if (!form.code) missingFields.push("Mã sản phẩm");
            if (!form.name) missingFields.push("Tên sản phẩm");
            if (!form.price) missingFields.push("Giá bán");
            if (!form.stock) missingFields.push("Số lượng tồn kho");
            if (!form.category_id) missingFields.push("Danh mục");

            if (missingFields.length > 0) {
                alert("⚠️ Vui lòng nhập đầy đủ các thông tin sau:\n- " + missingFields.join("\n- "));
                return; 
            }

            if (editing) {
                router.put(route("admin.products.update", editing.id), form);
            } else {
                router.post(route("admin.products.store"), form);
            }
            
            resetForm();
            setShowForm(false);
        };

        const filteredProducts = products.filter((p) =>
            removeVietnameseTones(p.name).includes(removeVietnameseTones(searchProduct))
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
                        placeholder="🔍 Tìm sản phẩm...(nhập tên)"
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
                        placeholder="Mã sản phẩm (VD: SP01)"
                        className="border p-2 rounded"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Tên sản phẩm"
                        className="border p-2 rounded"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Giá"
                        className="border p-2 rounded"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Tồn kho"
                        className="border p-2 rounded"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        required
                    />

                    <select
                        className="border p-2 rounded"
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                        required
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select 
                        className="border p-2 rounded" 
                        value={form.supplier_id} 
                        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                    >
                        <option value="">-- Chọn Nhà cung cấp  --</option>
                        {suppliers && suppliers.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <div className="col-span-2 flex gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded shadow transition"
                        >
                            Hủy bỏ
                        </button>

                        {/* Nút Submit */}
                        <button 
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow transition"
                        >
                            {editing ? "Cập nhật sản phẩm" : "Lưu sản phẩm mới"}
                        </button>
                    </div>
                </form>
                )}

                {/* ================= DANH SÁCH SẢN PHẨM ================= */}
                <div className="bg-white shadow rounded overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Mã Code</th> 
                                    <th className="px-4 py-3">Tên sản phẩm</th>
                                    <th className="px-4 py-3">Danh mục</th>
                                    <th className="px-4 py-3">Nhà cung cấp</th>
                                    <th className="px-4 py-3 text-right">Giá bán</th>
                                    <th className="px-4 py-3 text-right">Tồn kho</th>
                                    <th className="px-4 py-3 text-center">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-700">
                                            {p.code}
                                        </td>
                                        
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {p.name}
                                        </td>
                                        
                                        <td className="px-4 py-3">
                                            {p.category?.name}
                                        </td>
                                        
                                        <td className="px-4 py-3 text-blue-600">
                                            {p.supplier?.name || <span className="text-gray-400">-</span>}
                                        </td>
                                        
                                        <td className="px-4 py-3 text-right text-green-600 font-bold">
                                            {parseInt(p.price).toLocaleString()}₫
                                        </td>
                                        
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            {p.stock}
                                        </td>
                                        
                                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs transition"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if(confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                                                        router.delete(route("admin.products.destroy", p.id));
                                                    }
                                                }}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredProducts.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                Không tìm thấy sản phẩm nào phù hợp.
                            </div>
                        )}
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
            removeVietnameseTones(c.name).includes(removeVietnameseTones(searchCategory))
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
                            placeholder="Tên danh mục cần thêm"
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
