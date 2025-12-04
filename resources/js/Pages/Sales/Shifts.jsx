import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; 

// --- CÁC HÀM HELPER ---

// Hàm helper để định dạng tiền tệ
const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return num.toLocaleString('vi-VN') + '₫';
};

// Hàm định dạng ngày giờ (sử dụng Date object)
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(',', '');
};

// Hàm kiểm tra chênh lệch để tô màu
const getDifferenceClass = (diff) => {
    if (diff === null || diff === undefined) return 'text-gray-500';
    const difference = Number(diff); 
    if (difference > 0) return 'text-green-600 font-bold'; // Thừa tiền
    if (difference < 0) return 'text-red-600 font-bold';   // Thiếu tiền
    return 'text-gray-600 font-bold'; // Khớp (0)
};

// --- COMPONENT CHÍNH ---

export default function Shifts({ activeShift, shifts, liveRevenue, bankOrders }) {
    
    // State quản lý form
    const [openingCash, setOpeningCash] = useState('');
    const [closingCash, setClosingCash] = useState('');
    const [processing, setProcessing] = useState(false);

    // Xử lý dữ liệu đầu vào (Hỗ trợ phân trang Laravel hoặc Array thường)
    const shiftsList = shifts.data ? shifts.data : (Array.isArray(shifts) ? shifts : []);
    const paginationLinks = shifts.links || [];
    const safeBankOrders = bankOrders || []; // Đảm bảo không lỗi nếu bankOrders null

    // Tính tổng tiền chuyển khoản để hiển thị đối soát
    const totalBankAmount = safeBankOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

    // --- CÁC HÀM XỬ LÝ ---

    // Mở ca
    const startShift = () => {
        setProcessing(true);
        router.post("/sales/shifts/start", {
            opening_cash: openingCash,
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    // Đóng ca
    const closeShift = () => {
        if(!confirm("Bạn có chắc chắn muốn chốt sổ và đóng ca làm việc này không?")) return;
        
        setProcessing(true);
        router.post("/sales/shifts/close", {
            closing_cash: closingCash,
        }, {
            onFinish: () => {
                setProcessing(false);
                setClosingCash('');
            }
        });
    };
    
    return (
        <AuthenticatedLayout>
            <Head title="Quản lý ca làm" />
            
            <div className="min-h-screen bg-gray-50 p-6">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800">
                            ⏳ QUẢN LÝ CA LÀM VIỆC
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý két tiền và đối soát doanh thu</p>
                    </div>
                    <Link
                        href="/sales"
                        className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150 shadow"
                    >
                        🛒 Quay lại Bán hàng
                    </Link>
                </div>

                {/* --- KHU VỰC TRẠNG THÁI CA (ACTIVE SHIFT) --- */}
                <div className={`mb-8 p-6 rounded-xl shadow-lg border-t-4 ${activeShift ? 'bg-white border-green-500' : 'bg-white border-gray-400'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            TRẠNG THÁI: 
                            {activeShift ? (
                                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200 animate-pulse">
                                    🟢 ĐANG MỞ CỬA
                                </span>
                            ) : (
                                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full border border-gray-200">
                                    ⛔ ĐÃ ĐÓNG CỬA
                                </span>
                            )}
                        </h2>
                    </div>
                    
                    {activeShift ? (

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* CỘT TRÁI (2/3): Thông tin ca & Form đóng ca */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Thông tin chung */}
                                <div className="space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="flex justify-between border-b pb-2">
                                        <span>👤 Người mở ca:</span> 
                                        <span className="font-bold text-gray-900">{activeShift.user?.name}</span>
                                    </p>
                                    <p className="flex justify-between border-b pb-2">
                                        <span>⏰ Thời gian mở:</span> 
                                        <span className="font-semibold">{formatDateTime(activeShift.start_time)}</span>
                                    </p>
                                    <p className="flex justify-between text-lg">
                                        <span>💵 Vốn đầu ca:</span> 
                                        <span className="font-bold text-green-700">{formatCurrency(activeShift.opening_cash)}</span>
                                    </p>
                                    
                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                        <p className="text-blue-800 font-semibold mb-1">Doanh thu tạm tính (trong ca này):</p>
                                        <p className="text-3xl font-extrabold text-blue-600">{formatCurrency(liveRevenue)}</p>
                                        <p className="text-xs text-gray-500 mt-1">*Bao gồm Tiền mặt + Chuyển khoản (Chưa gồm vốn đầu ca)</p>
                                    </div>
                                </div>

                                {/* Form đóng ca */}
                                <div className="flex flex-col justify-end bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
                                    <h3 className="font-bold text-red-800 mb-3 border-b border-red-200 pb-2">KẾT THÚC CA LÀM VIỆC</h3>
                                    <label className="block mb-2 font-semibold text-gray-700">
                                        Tổng tiền mặt thực tế trong két (Chỉ đếm tiền giấy):
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            className="flex-1 border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg focus:border-red-500 focus:ring-red-500"
                                            value={closingCash}
                                            onChange={(e) => setClosingCash(e.target.value)} 
                                            placeholder="Đếm tiền và nhập vào đây..."
                                        />
                                        <button
                                            className={`bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 font-bold transition whitespace-nowrap ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={closeShift}
                                            disabled={!closingCash || processing}
                                        >
                                            {processing ? 'Đang xử lý...' : 'CHỐT & ĐÓNG CA'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red-500 mt-2 italic">
                                        * Lưu ý: Hãy đếm kỹ tiền mặt. Hệ thống sẽ tự động tính toán chênh lệch.
                                    </p>
                                </div>
                            </div>

                            {/* CỘT PHẢI (1/3): Đối soát chuyển khoản */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-fit shadow-sm">
                                <h3 className="font-bold text-blue-800 mb-3 flex items-center justify-between border-b border-blue-200 pb-2">
                                    <span>💳 GIAO DỊCH BANK</span>
                                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{safeBankOrders.length} đơn</span>
                                </h3>
                                
                                <div className="mb-4 text-center bg-white p-3 rounded border border-blue-100">
                                    <p className="text-xs text-blue-600 uppercase font-semibold">Tổng tiền vào tài khoản</p>
                                    <p className="text-xl font-bold text-blue-900">{formatCurrency(totalBankAmount)}</p>
                                </div>

                                {/* Danh sách cuộn */}
                                <div className="max-h-80 overflow-y-auto bg-white rounded border border-blue-100 shadow-inner">
                                    {safeBankOrders.length === 0 ? (
                                        <p className="p-8 text-center text-gray-400 text-sm italic">
                                            Chưa có giao dịch chuyển khoản nào trong ca này.
                                        </p>
                                    ) : (
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-blue-100 text-blue-800 font-semibold sticky top-0">
                                                <tr>
                                                    <th className="p-2">Mã HĐ</th>
                                                    <th className="p-2 text-right">Số tiền</th>
                                                    <th className="p-2 text-center">Giờ</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {safeBankOrders.map(order => (
                                                    <tr key={order.id} className="hover:bg-blue-50">
                                                        <td className="p-2 font-medium text-gray-700">
                                                            <div>#{order.invoice_code || order.id}</div>
                                                            <div className="text-[10px] text-gray-500">{order.user?.name}</div>
                                                        </td>
                                                        <td className="p-2 text-right font-bold text-blue-600">
                                                            {formatCurrency(order.total_amount)}
                                                        </td>
                                                        <td className="p-2 text-center text-gray-500">
                                                            {new Date(order.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <p className="text-[10px] text-blue-500 mt-3 italic text-center">
                                    * Vui lòng kiểm tra app ngân hàng để đảm bảo đã nhận đủ số tiền này.
                                </p>
                            </div>
                        </div>
                    ) : (
                        // ============================================
                        // GIAO DIỆN KHI CHƯA CÓ CA (MỞ CA MỚI)
                        // ============================================
                        <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center md:text-left flex flex-col md:flex-row items-center gap-6 shadow-sm">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-green-800 mb-2">👋 Chào bạn, bắt đầu ngày làm việc mới?</h3>
                                <p className="text-gray-600 mb-4">
                                    Vui lòng kiểm tra và nhập số tiền mặt đang có trong két (tiền lẻ thối lại) để mở ca.
                                </p>
                                <div className="max-w-md">
                                    <label className="block mb-1 font-semibold text-gray-700">Tiền đầu ca (Tiền mặt):</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            className="flex-1 border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg focus:border-green-500 focus:ring-green-500"
                                            value={openingCash}
                                            onChange={(e) => setOpeningCash(e.target.value)} 
                                            placeholder="VD: 1000000"
                                        />
                                        <button
                                            className={`bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 font-bold transition whitespace-nowrap ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={startShift}
                                            disabled={!openingCash || processing} 
                                        >
                                            {processing ? 'Đang mở...' : '🚀 MỞ CA NGAY'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block text-9xl opacity-20 select-none">🏪</div>
                        </div>
                    )}
                </div>

                {/* --- LỊCH SỬ CA LÀM --- */}
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    📜 LỊCH SỬ ĐÓNG/MỞ CA
                </h2>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700 text-white">
                                <th className="p-4 text-center w-12">#</th>
                                <th className="p-4">Người phụ trách</th>
                                <th className="p-4">Thời gian</th>
                                <th className="p-4 text-right">Vốn đầu ca</th>
                                <th className="p-4 text-right">Doanh thu</th>
                                <th className="p-4 text-right bg-slate-800">Thực tế két</th>
                                <th className="p-4 text-right">Chênh lệch</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {shiftsList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">
                                        Chưa có dữ liệu ca làm việc.
                                    </td>
                                </tr>
                            ) : (
                                shiftsList.map((shift, index) => (
                                    <tr 
                                        key={shift.id} 
                                        className={`hover:bg-blue-50 transition ${!shift.end_time ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                                    >
                                        <td className="p-4 text-center text-gray-500">{shift.id}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-800">{shift.user?.name || "---"}</div>
                                            {!shift.end_time && <span className="text-xs text-green-600 font-bold animate-pulse">● Đang mở</span>}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div>Mở: {formatDateTime(shift.start_time)}</div>
                                            {shift.end_time && <div>Đóng: {formatDateTime(shift.end_time)}</div>}
                                        </td>
                                        
                                        <td className="p-4 text-right text-gray-600 font-medium">
                                            {formatCurrency(shift.opening_cash)}
                                        </td>
                                        <td className="p-4 text-right text-blue-600 font-bold">
                                            {formatCurrency(shift.total_revenue ?? 0)}
                                        </td>
                                        <td className="p-4 text-right font-bold bg-slate-50 border-x border-slate-100">
                                            {shift.end_time ? formatCurrency(shift.closing_cash) : <span className="text-gray-400">---</span>}
                                        </td>
                                        <td className={`p-4 text-right ${getDifferenceClass(shift.difference)}`}>
                                            {shift.end_time ? formatCurrency(shift.difference) : <span className="text-gray-400">---</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    
                    {/* --- PHÂN TRANG (Pagination) --- */}
                    {paginationLinks.length > 3 && (
                        <div className="p-4 border-t flex justify-center flex-wrap gap-1 bg-gray-50">
                            {paginationLinks.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1 border rounded text-sm ${
                                            link.active 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}