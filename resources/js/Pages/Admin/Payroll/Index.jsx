import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const formatVND = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';

export default function PayrollIndex({ payroll, filters }) {
    const [month, setMonth] = useState(filters.month);

    const handleFilter = () => {
        router.get(route('admin.payroll.index'), { month }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Bảng Lương" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">💰 Bảng Tính Lương</h1>
                <div className="flex gap-2 items-center">
                    <label>Tháng:</label>
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded p-2"
                    >
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                    <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">Xem</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                        <tr>
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4 text-center">Số ca làm</th>
                            <th className="p-4 text-center">Tổng giờ làm</th>
                            <th className="p-4 text-right">Lương/Giờ</th>
                            <th className="p-4 text-right text-blue-700">Tạm tính lương</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payroll.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4 text-center">{p.sessions_count}</td>
                                <td className="p-4 text-center">{p.total_hours} giờ</td>
                                <td className="p-4 text-right">{formatVND(p.hourly_rate)}</td>
                                <td className="p-4 text-right font-bold text-lg text-blue-600">
                                    {formatVND(p.total_salary)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}