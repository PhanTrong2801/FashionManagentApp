import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// --- MODAL THÊM / SỬA ---
const SupplierModal = ({ supplier, onClose }) => {
    const isEdit = !!supplier;
    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name || '',
        contact_name: supplier?.contact_name || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
        note: supplier?.note || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.suppliers.update', supplier.id), { onSuccess: onClose });
        } else {
            post(route('admin.suppliers.store'), { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-gray-800">{isEdit ? '✏️ Cập nhật NCC' : '✨ Thêm NCC mới'}</h2>
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Tên Nhà Cung Cấp *</label>
                        <input type="text" className="w-full border rounded p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium">Người liên hệ</label>
                            <input type="text" className="w-full border rounded p-2" value={data.contact_name} onChange={e => setData('contact_name', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Số điện thoại</label>
                            <input type="text" className="w-full border rounded p-2" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" className="w-full border rounded p-2" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Địa chỉ</label>
                        <textarea className="w-full border rounded p-2" rows="2" value={data.address} onChange={e => setData('address', e.target.value)}></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu lại</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
export default function SupplierIndex({ suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalData, setModalData] = useState({ isOpen: false, supplier: null });

    const handleSearch = () => {
        router.get(route('admin.suppliers.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if(confirm('Xóa nhà cung cấp này?')) router.delete(route('admin.suppliers.destroy', id));
    };

    return (
        <AdminLayout>
            <Head title="Nhà cung cấp" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏭 Nhà Cung Cấp</h1>
                <div className="flex gap-2">
                    <input 
                        type="text" placeholder="Tìm tên, sđt..." className="border rounded px-3 py-2 text-sm"
                        value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={() => setModalData({ isOpen: true, supplier: null })} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Thêm mới
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                        <tr>
                            <th className="p-4">Tên NCC</th>
                            <th className="p-4">Liên hệ</th>
                            <th className="p-4">Địa chỉ</th>
                            <th className="p-4 text-center">Sản phẩm</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {suppliers.data.length === 0 ? (
                            <tr><td colSpan="5" className="p-6 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
                        ) : (
                            suppliers.data.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{s.name}</div>
                                        <div className="text-xs text-gray-500">{s.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div>{s.contact_name}</div>
                                        <div className="text-blue-600 font-mono">{s.phone}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 max-w-xs truncate">{s.address}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                            {s.products_count} SP
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => setModalData({ isOpen: true, supplier: s })} className="text-blue-600 hover:underline">Sửa</button>
                                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-center gap-1">
                {suppliers.links.map((link, i) => (
                    link.url ? (
                        <Link key={i} href={link.url} className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : <span key={i} className="px-3 py-1 border rounded text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                ))}
            </div>

            {modalData.isOpen && (
                <SupplierModal 
                    supplier={modalData.supplier} 
                    onClose={() => setModalData({ isOpen: false, supplier: null })} 
                />
            )}
        </AdminLayout>
    );
}