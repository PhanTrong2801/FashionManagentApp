import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; 


// Hàm helper để định dạng tiền tệ
const formatCurrency = (amount) => {
    const num = Math.round(amount || 0);
    return num.toLocaleString('vi-VN') + '₫';
};

// Hàm định dạng ngày giờ (sử dụng Date object)
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(',', '');
};

// Hàm kiểm tra chênh lệch để tô màu
const getDifferenceClass = (diff) => {
    if (diff === null || diff === undefined) return 'text-gray-500';
    const difference = Number(diff); 
    if (difference > 0) return 'text-red-600 font-bold'; 
    if (difference < 0) return 'text-orange-600 font-bold'; 
    return 'text-green-600 font-bold'; 
};


export default function Shifts({ activeShift, shifts, liveRevenue }) {
    
    const [openingCash, setOpeningCash] = useState(0);
    const [closingCash, setClosingCash] = useState(0);

    
    const startShift = () => {
        router.post("/sales/shifts/start", {
            opening_cash: openingCash,
        });
    };

    const closeShift = () => {
        router.post("/sales/shifts/close", {
            closing_cash: closingCash,
        });
    };
    
    
    return (
        <AuthenticatedLayout>
            <Head title="Quản lý ca làm" />
            
            <div className="min-h-screen bg-gray-50 p-6">
                
               
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-3xl font-extrabold text-blue-800">
                        ⏳ QUẢN LÝ CA LÀM
                    </h1>
                    <div className='flex gap-3 text-sm'>
                     
                        <Link
                            href="/sales"
                            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                        >
                            🛒 Quay lại Bán hàng
                        </Link>
                    </div>
                </div>


                <div className="mb-6 p-6 bg-white rounded-xl shadow-xl border-t-4 border-blue-600">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        {activeShift ? '✅ CA ĐANG MỞ' : '❌ CHƯA CÓ CA NÀO ĐƯỢC MỞ'}
                    </h2>
                    
                    {activeShift ? (
                      
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-lg">
                                <p><b>⏰ Bắt đầu:</b> <span className="font-semibold">{formatDateTime(activeShift.start_time)}</span></p>
                                <p><b>💵 Tiền đầu ca:</b> <span className="font-semibold text-green-700">{formatCurrency(activeShift.opening_cash)}</span></p>
                                {/* Thêm thông tin người mở ca nếu có */}
                                <p><b>👤 Người mở:</b> {activeShift.user?.name || 'Không xác định'}</p> 
                            </div>
                            {/*  Doanh thu hiện tại */}
                            <div className="text-xl font-bold text-blue-700 bg-blue-100 p-4 rounded-lg shadow">
                                💰 Doanh thu hiện tại: {formatCurrency(liveRevenue || 0)}
                            </div>

                            <hr className="my-4 border-gray-200" />

                            <div className="flex items-end gap-4">
                                <div className="flex-1 max-w-xs">
                                    <label className="block mb-1 font-semibold text-gray-700">Tiền cuối ca (Thực tế)</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-lg shadow-sm px-4 py-2 w-full text-lg focus:border-red-500 focus:ring-red-500 transition"
                                        value={closingCash}
                                        onChange={(e) => setClosingCash(e.target.value)} 
                                        placeholder="Nhập số tiền thực tế"
                                    />
                                </div>
                                
                                <button
                                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-red-700 font-bold transition transform hover:scale-[1.02]"
                                    onClick={closeShift}
                                    disabled={closingCash === 0 || closingCash === ''}
                                >
                                    ĐÓNG CA
                                </button>
                            </div>
                        </div>
                    ) : (
                        // UI khi CHƯA CÓ CA NÀO MỞ
                        <div className="space-y-4">
                            <div className="flex items-end gap-4">
                                <div className="flex-1 max-w-xs">
                                    <label className="block mb-1 font-semibold text-gray-700">Tiền đầu ca (Tiền mặt)</label>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-lg shadow-sm px-4 py-2 w-full text-lg focus:border-green-500 focus:ring-green-500 transition"
                                        value={openingCash}
                                        
                                        onChange={(e) => setOpeningCash(e.target.value)} 
                                        placeholder="Nhập số tiền mặt ban đầu"
                                    />
                                </div>

                                <button
                                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-green-700 font-bold transition transform hover:scale-[1.02]"
                                    onClick={startShift}
                                    disabled={openingCash === 0 || openingCash === ''} 
                                >
                                    MỞ CA
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Lịch sử ca làm</h2>

                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-white shadow-md">
                                <th className="p-4 w-[5%]">#</th>
                                <th className="p-4 w-[12%]">Nhân viên</th>
                                <th className="p-4 w-[15%]">Bắt đầu</th>
                                <th className="p-4 w-[15%]">Kết thúc</th>
                                <th className="p-4 w-[10%] text-center">Đầu ca</th>
                                <th className="p-4 w-[10%] text-center">Cuối ca</th>
                                <th className="p-4 w-[10%] text-center">Doanh thu</th>
                                <th className="p-4 w-[10%] text-center">Tiền mặt</th>
                                <th className="p-4 w-[10%] text-center">Ngân hàng</th>
                                <th className="p-4 w-[10%] text-center">Chênh lệch</th>
                            </tr>
                        </thead>

                        <tbody>
                            {shifts.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-6 text-gray-500 text-lg">
                                        Chưa có lịch sử ca làm nào.
                                    </td>
                                </tr>
                            ) : (
                                shifts.map((shift, index) => (
                                    <tr 
                                        key={shift.id} 
                                        className={`hover:bg-blue-50 transition ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
                                    >
                                        <td className="p-4 text-sm font-semibold text-center">{index + 1}</td>
                                        <td className="p-4 text-sm font-medium">
                                            {shift.user?.name || "Không xác định"}
                                        </td>
                                        <td className="p-4 text-sm">{formatDateTime(shift.start_time)}</td>
                                        <td className="p-4 text-sm">{shift.end_time ? formatDateTime(shift.end_time) : <span className="text-blue-500 font-medium">—</span>}</td>
                                        
                                        {/* Định dạng tiền tệ */}
                                        <td className="p-4 text-sm text-center font-medium text-green-700">{formatCurrency(shift.opening_cash)}</td>
                                        <td className="p-4 text-sm text-center font-medium">{shift.closing_cash ? formatCurrency(shift.closing_cash) : "--"}</td>
                                        <td className="p-4 text-sm text-center font-bold text-blue-700">{formatCurrency(shift.total_revenue ?? 0)}</td>
                                        <td className="p-4 text-sm text-center">{formatCurrency(shift.total_cash ?? 0)}</td>
                                        <td className="p-4 text-sm text-center">{formatCurrency(shift.total_bank ?? 0)}</td>
                                        <td className="p-4 text-sm text-center">
                                            <span className={getDifferenceClass(shift.difference)}>
                                                {formatCurrency(shift.difference ?? 0)}
                                            </span>
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