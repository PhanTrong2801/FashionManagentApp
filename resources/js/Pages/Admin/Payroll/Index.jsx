import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const formatVND = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';

// --- MODAL SỬA LƯƠNG ---
const EditRateModal = ({ user, onClose }) => {
    const { data, setData, post, processing } = useForm({
        hourly_rate: user.hourly_rate
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.payroll.update_rate', user.id), {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-96" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Sửa lương cơ bản</h3>
                <p className="mb-2 text-gray-600">Nhân viên: <b>{user.name}</b></p>
                
                <form onSubmit={submit}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lương theo giờ (VNĐ):</label>
                    <input 
                        type="number" 
                        className="w-full border rounded p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                        value={data.hourly_rate}
                        onChange={e => setData('hourly_rate', e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {processing ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
export default function PayrollIndex({ payroll, filters }) {
    const [month, setMonth] = useState(filters.month);
    const [year, setYear] = useState(filters.year);
    const [editingUser, setEditingUser] = useState(null); // State để mở Modal

    const handleFilter = () => {
        router.get(route('admin.payroll.index'), { month, year }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('admin.payroll.export', { month, year });
    };

    return (
        <AdminLayout>
            <Head title="Bảng Lương" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">💰 Bảng Tính Lương</h1>
                
                <div className="flex gap-2 items-center bg-white p-2 rounded shadow-sm border">
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)}
                        className="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                        ))}
                    </select>

                    <select 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        className="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500"
                    >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>

                    <button 
                        onClick={handleFilter} 
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200 border"
                    >
                        Xem
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* ✨ NÚT XUẤT EXCEL MỚI ✨ */}
                    <button 
                        onClick={handleExport} 
                        className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 flex items-center gap-2 shadow-sm"
                    >
                        📥 Xuất Excel
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                        <tr>
                            <th className="p-4 border-b">Nhân viên</th>
                            <th className="p-4 border-b text-center">Số ca làm</th>
                            <th className="p-4 border-b text-center">Tổng giờ làm</th>
                            <th className="p-4 border-b text-right">Lương/Giờ</th>
                            <th className="p-4 border-b text-right text-blue-700">Thực nhận</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {payroll.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">Chưa có dữ liệu chấm công tháng này.</td>
                            </tr>
                        ) : (
                            payroll.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                                    <td className="p-4 text-center">{p.sessions_count}</td>
                                    <td className="p-4 text-center font-mono">{p.total_hours}h</td>
                                    
                                    {/* ✨ CỘT LƯƠNG CÓ THỂ BẤM VÀO ĐỂ SỬA ✨ */}
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => setEditingUser(p)}
                                            className="text-gray-700 hover:text-blue-600 hover:underline font-medium flex items-center justify-end gap-1 ml-auto"
                                            title="Bấm để sửa lương cơ bản"
                                        >
                                            {formatVND(p.hourly_rate)} 
                                            <span className="text-xs text-gray-400">✎</span>
                                        </button>
                                    </td>

                                    <td className="p-4 text-right font-bold text-lg text-blue-600">
                                        {formatVND(p.total_salary)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Sửa Lương */}
            {editingUser && (
                <EditRateModal 
                    user={editingUser} 
                    onClose={() => setEditingUser(null)} 
                />
            )}
        </AdminLayout>
    );
}