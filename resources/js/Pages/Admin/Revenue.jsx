import React, {useState} from "react";
import { Head, router } from "@inertiajs/react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';


export default function Revenue({ revenue, start, end, totalRevenue}){
    const [filters, setFilters] = useState({
        start_date: start,
        end_date: end,
    });

    const handleChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value});
    };

    const handleFilter = (e) =>{
        e.preventDefault();
        router.get('/admin/revenue', filters);
    };

    return(
        <div className="p-6">
            <Head title="Thống kê doanh thu"/>
            <h1 className="text-3xl font-bold mb-6">Thống Kê Doanh Thu</h1>

            <form onSubmit={handleFilter} className="flex items-end gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Từ ngày</label>
                    <input
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2"
                        />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Đến ngày</label>
                    <input
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2"
                        />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Lọc
                </button>

            </form>

               {/* --- Tổng doanh thu --- */}
            <div className="bg-white shadow rounded-xl p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                    Tổng doanh thu trong khoảng:
                </h2>
                <p className="text-2xl font-bold text-green-600 mt-1">
                    {totalRevenue.toLocaleString()} ₫
                </p>
            </div>

            {/* --- Biểu đồ doanh thu --- */}
            <div className="bg-white shadow rounded-xl p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Biểu đồ doanh thu theo ngày</h2>
                {revenues.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenues}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian này.</p>
                )}
            </div>

            {/* --- Bảng chi tiết doanh thu --- */}
            <div className="bg-white shadow rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Chi tiết doanh thu theo ngày</h2>
                <table className="w-full border text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Ngày</th>
                            <th className="p-2">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {revenues.map((item) => (
                            <tr key={item.date} className="border-t">
                                <td className="p-2">{item.date}</td>
                                <td className="p-2">{item.total.toLocaleString()} ₫</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}