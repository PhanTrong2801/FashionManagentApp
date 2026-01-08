import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'; 
import AdminLayout from '@/Layouts/AdminLayout';

// --- HELPERS ---
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const formatDateTime = (d) => new Date(d).toLocaleString('vi-VN');

// --- MODAL CHI TIẾT & CHỈNH SỬA ĐƠN HÀNG ---
const OrderDetailModal = ({ order, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, reset, errors } = useForm({
        items: [],
        edit_note: '',
    });

    // Khi mở modal hoặc đổi đơn hàng, load dữ liệu vào form
    useEffect(() => {
        if (order) {
            setData({
                items: order.items.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    product_name: item.product?.name, 
                    product_color: item.product?.color, 
                    product_size: item.product?.size,
                    product_code: item.product?.code,
                    quantity: item.quantity,
                    price: item.price,
                })),
                edit_note: order.edit_note || '',
            });
            setIsEditing(false); 
        }
    }, [order]);

    if (!order) return null;

    // Tính tổng tiền realtime khi sửa
    const currentTotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // --- 2. TÍNH TOÁN TIỀN KHÁCH ĐƯA & TIỀN THỐI (Dùng cho chế độ XEM) ---
    const customerPay = order.customer_money || 0; 
    const changeDue = customerPay - order.total_amount; 
    // ---------------------------------------------------------------------

    // Xử lý thay đổi số lượng
    const handleQtyChange = (index, newQty) => {
        const updatedItems = [...data.items];
        updatedItems[index].quantity = parseInt(newQty) || 0;
        setData('items', updatedItems);
    };

    // Xử lý xóa sản phẩm khỏi đơn
    const handleRemoveItem = (index) => {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi đơn hàng?')) {
            const updatedItems = data.items.filter((_, i) => i !== index);
            setData('items', updatedItems);
        }
    };

    // Gửi dữ liệu cập nhật
    const handleSave = () => {
        if (data.items.length === 0) {
            alert("Đơn hàng phải có ít nhất 1 sản phẩm!");
            return;
        }
        if (!data.edit_note.trim()) {
            alert("Vui lòng nhập lý do chỉnh sửa!");
            return;
        }

        put(route('admin.orders.update', order.id), {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header Modal */}
                <div className={`p-4 flex justify-between items-center ${isEditing ? 'bg-yellow-600' : 'bg-blue-600'} text-white`}>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {isEditing ? '🛠 ĐANG CHỈNH SỬA: ' : 'Chi tiết đơn hàng #'}
                        {order.invoice_code || order.id}
                        {order.is_edited && !isEditing && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded ml-2 animate-pulse">Edited</span>
                        )}
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* Thông tin chung */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b pb-4">
                        <div>
                            <p className="text-gray-500">Khách hàng:</p>
                            <p className="font-bold text-lg">{order.customer?.name || 'Khách lẻ'}</p>
                            <p>{order.customer?.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Trạng thái hiện tại:</p>
                            <p className="font-bold">{order.is_edited ? <span className="text-red-500">Đã chỉnh sửa</span> : <span className="text-green-600">Gốc</span>}</p>
                            {order.edit_note && (
                                <p className="text-xs text-red-500 italic mt-1 bg-red-50 p-1 rounded inline-block">Note: {order.edit_note}</p>
                            )}
                        </div>
                    </div>

                    {/* --- CHẾ ĐỘ XEM (VIEW MODE) --- */}
                    {!isEditing ? (
                        <>
                            <table className="w-full text-left border-collapse text-sm mb-4">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Sản phẩm</th>
                                        <th className="p-2 border text-center">P.Loại</th> 
                                        <th className="p-2 border text-center">SL</th>
                                        <th className="p-2 border text-right">Đơn giá</th>
                                        <th className="p-2 border text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border">
                                                <div className="font-medium">{item.product?.name || <span className='text-red-500'>SP đã xóa</span>}</div>
                                                <div className="text-xs text-gray-500">{item.product?.code}</div>
                                            </td>
                                            <td className="p-2 border text-center text-xs">
                                                <div className='flex flex-col items-center gap-1'>
                                                    {item.product?.color && <span className="bg-gray-100 text-gray-600 px-1 rounded border">{item.product.color}</span>}
                                                    {item.product?.size && <span className="bg-white text-gray-800 px-1 rounded border font-bold">Sz: {item.product.size}</span>}
                                                </div>
                                            </td>
                                            <td className="p-2 border text-center">{item.quantity}</td>
                                            <td className="p-2 border text-right">{formatCurrency(item.price)}</td>
                                            <td className="p-2 border text-right">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* --- 5. HIỂN THỊ TIỀN KHÁCH ĐƯA VÀ TIỀN THỪA --- */}
                            <div className="flex flex-col items-end gap-1 mt-4 border-t pt-4">
                                <div className="flex justify-between w-64 text-sm">
                                    <span className="text-gray-600">Tổng tiền hàng:</span>
                                    <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between w-64 text-sm">
                                    <span className="text-gray-600">Tiền khách đưa:</span>
                                    <span className="font-bold text-green-600">
                                        {customerPay > 0 ? formatCurrency(customerPay) : '---'}
                                    </span>
                                </div>
                                <div className="flex justify-between w-64 text-xl font-bold text-red-600 border-t border-dashed border-gray-300 pt-2 mt-1">
                                    <span>Tiền thừa:</span>
                                    <span>{changeDue >= 0 ? formatCurrency(changeDue) : '0₫'}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* --- CHẾ ĐỘ CHỈNH SỬA */
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800 mb-2">
                                ⚠️ Lưu ý: Việc chỉnh sửa sẽ cập nhật lại tồn kho. Hãy kiểm tra kỹ!
                            </div>

                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Sản phẩm</th>
                                        <th className="p-2 border text-center">P.Loại</th>
                                        <th className="p-2 border text-center w-20">SL</th>
                                        <th className="p-2 border text-right">Đơn giá</th>
                                        <th className="p-2 border text-right">Thành tiền</th>
                                        <th className="p-2 border text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-2 border font-medium">
                                                {item.product_name || 'SP không xác định'}
                                                <div className="text-xs text-gray-400 font-normal">{item.product_code}</div>
                                            </td>
                                            <td className="p-2 border text-center text-xs">
                                                <div className='flex flex-col items-center gap-1'>
                                                     {item.product_color && <span className="bg-gray-100 px-1 rounded border">{item.product_color}</span>}
                                                     {item.product_size && <span className="bg-white px-1 rounded border font-bold">Sz: {item.product_size}</span>}
                                                </div>
                                            </td>
                                            <td className="p-2 border text-center">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    className="w-16 p-1 border rounded text-center focus:border-blue-500 focus:ring-blue-500"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 border text-right text-gray-500">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="p-2 border text-right font-bold">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                            <td className="p-2 border text-center">
                                                <button 
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="text-red-500 hover:text-red-700 font-bold px-2"
                                                >
                                                    &times;
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Khu vực Tổng tiền & Ghi chú */}
                            <div className="flex flex-col items-end gap-2 mt-4 border-t pt-4">
                                <div className="text-xl font-bold text-blue-600">
                                    Tổng mới: {formatCurrency(currentTotal)}
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do chỉnh sửa (*):</label>
                                    <textarea
                                        className="w-full border rounded p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Ví dụ: Khách đổi ý, Nhập sai số lượng..."
                                        rows="2"
                                        value={data.edit_note}
                                        onChange={(e) => setData('edit_note', e.target.value)}
                                    ></textarea>
                                    {errors.edit_note && <p className="text-red-500 text-xs mt-1">{errors.edit_note}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                    {!isEditing ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium">
                                Đóng
                            </button>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-bold flex items-center gap-2"
                            >
                                ✏️ Chỉnh sửa đơn hàng
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => { setIsEditing(false); reset(); }} 
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
                                disabled={processing}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleSave} 
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow-lg flex items-center gap-2"
                                disabled={processing}
                            >
                                {processing ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH  ---
export default function OrderIndex({ orders, filters }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSearch = () => {
        router.get(route('admin.orders.index'), { search, date }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Quản lý Hóa đơn" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">🧾 Danh Sách Hóa Đơn</h1>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="date" 
                        className="border rounded px-3 py-2 text-sm"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Tìm mã đơn, tên khách..." 
                        className="border rounded px-3 py-2 text-sm flex-1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Lọc</button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                        <tr>
                            <th className="p-4">Mã HĐ</th>
                            <th className="p-4">Ngày tạo</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Nhân viên</th>
                            <th className="p-4 text-center">TT</th>
                            <th className="p-4 text-right">Tổng tiền</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {orders.data.length === 0 ? (
                            <tr><td colSpan="7" className="p-6 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
                        ) : (
                            orders.data.map((order) => (
                                <tr key={order.id} className={`hover:bg-gray-50 transition cursor-pointer ${order.is_edited ? 'bg-yellow-50/50' : ''}`} onClick={() => setSelectedOrder(order)}>
                                    <td className="p-4 font-bold text-blue-600">
                                        {order.invoice_code || `#${order.id}`}
                                        {order.is_edited && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded border border-red-200">EDITED</span>}
                                    </td>
                                    <td className="p-4 text-gray-600">{formatDateTime(order.created_at)}</td>
                                    <td className="p-4">
                                        {order.customer ? (
                                            <div>
                                                <div className="font-medium">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                            </div>
                                        ) : <span className="text-gray-400 italic">Khách lẻ</span>}
                                    </td>
                                    <td className="p-4 text-gray-700">{order.user?.name}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${order.payment_method === 'bank' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-red-600">
                                        {formatCurrency(order.total_amount)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-blue-600 hover:underline">Chi tiết</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Pagination */}
                <div className="p-4 border-t flex justify-center gap-1">
                    {orders.links.map((link, i) => (
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
                                className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            </div>

            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            
            {showSuccess && flash.success && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 animate-bounce-in">
                    <span className="text-2xl">✅</span>
                    <div>
                        <h4 className="font-bold text-sm">Thành công!</h4>
                        <p className="text-sm">{flash.success}</p>
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="ml-4 hover:text-green-200 font-bold">&times;</button>
                </div>
            )}
        </AdminLayout>
    );
}