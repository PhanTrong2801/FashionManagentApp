import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';



// Hàm helper để định dạng tiền tệ
const formatCurrency = (amount) => {
    // Đảm bảo amount là số và làm tròn trước khi định dạng
    const num = Math.round(amount || 0);
    // Sử dụng 'vi-VN' để định dạng tiền tệ Việt Nam (30.000₫)
    return num.toLocaleString('vi-VN') + '₫';
};

// Component Modal Tùy chỉnh
const CustomModal = ({ title, children, actions, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100" 
            onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click bên trong
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>
            <div>{children}</div>
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                {actions}
            </div>
        </div>
    </div>
);



export default function SalesDashboard({ products: initialProducts, categories: initialCategories, customers: initialCustomers }) {
    //  Use props or fallback to empty array
    const products = initialProducts || [];
    const categories = initialCategories || [];
    const customers = initialCustomers || [];

    // Quan ly nhieu don hang 
    const [carts, setCarts] = useState([
        { id: 1, items: [] }
    ]);
    const [activeCart, setActiveCart] = useState(1);
    // Đảm bảo currentCart luôn có giá trị (hoặc fallback)
    const currentCart = carts.find(c => c.id === activeCart) || { id: activeCart, items: [] };
    
    // State cho Modal/Thông báo 
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    // State mới để xử lý xác nhận xóa
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [cartToDeleteId, setCartToDeleteId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


    // State khác 
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchCustomer, setSearchCustomer] = useState('');
    const [showCategory, setShowCategory] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [customerMoney, setCustomerMoney] = useState('');
    const [changeMoney, setChangeMoney] = useState(0);

    // useForm 
    const { data, setData, post, processing } = useForm({
        items: [],
        payment_method: 'cash',
    });

    // --- Cart Management Logic ---
    const switchCart = (id) => setActiveCart(id);
    const addNewCart = () => {
        const newId = Date.now();
        setCarts([...carts, { id: newId, items: [] }]);
        setActiveCart(newId);
    };
    const updateCartItems = (items) => {
        setCarts(carts.map(c =>
            c.id === activeCart ? { ...c, items } : c
        ));
    }
    
    //Thong bao xac nhan xoa gio hang
    const handleDeleteCartAttempt = (id) => {
        const cartToDelete = carts.find(c => c.id === id);
        if (cartToDelete && cartToDelete.items.length > 0) {
            setCartToDeleteId(id);
            setShowDeleteConfirmationModal(true);
        } else {
            handleDeleteCart(id);
        }
    };

    const handleDeleteCart = (id) => {
        const updated = carts.filter(c => c.id !== id);

        if (id === activeCart) {
            if (updated.length === 0) {
                const newId = Date.now();
                setCarts([{ id: newId, items: [] }]);
                setActiveCart(newId);
            } else {
                // Chuyển sang đơn hàng đầu tiên còn lại
                setActiveCart(updated[0].id);  
            }
        }
        setCarts(updated);
        // Đóng modal xác nhận sau khi xóa
        setShowDeleteConfirmationModal(false);
        setCartToDeleteId(null);
    }
    
    // --- Product & Cart Operations ---
    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter((p) => p.category_id === selectedCategory);

    const addToCart = (product) => {
        const existing = currentCart.items.find((p) => p.id === product.id);
        let updated;

        if (existing) {
            updated = currentCart.items.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            );
        } else {
            // Đảm bảo sản phẩm có price
            updated = [...currentCart.items, { ...product, quantity: 1, price: product.price }]; 
        }

        updateCartItems(updated);
    };

    const updateQty = (id, qty) => {
        const newQty = parseInt(qty);
        // Xóa sản phẩm nếu số lượng < 1
        if (newQty < 1 || isNaN(newQty)) {
            updateCartItems(currentCart.items.filter(p => p.id !== id));
        } else {
            updateCartItems(
                currentCart.items.map(p =>
                    p.id === id ? { ...p, quantity: newQty } : p
                )
            );
        }
    };
    
    const removeItem = (id) => {
        updateCartItems(currentCart.items.filter(p => p.id !== id));
    };


    const total = currentCart.items.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // --- Payment Flow ---
    const handleOpenPayment = () => {
        if (currentCart.items.length === 0) return;
        setCustomerMoney(total.toString()); // Đặt mặc định tiền khách đưa = tổng tiền
        setChangeMoney(0);
        setShowPayModal(true);
    };

    const handleMoneyInput = (val) => {
        const amount = Number(val);
        setCustomerMoney(val);
        setChangeMoney(amount - total);
    };

    // Xác nhận thanh toán 
    const handleConfirmPayment = () => {
        if (customerMoney < total) {
            // Không làm gì nếu tiền khách đưa không đủ
            return; 
        }

        const payload = {
            items: currentCart.items.map(p => ({ id: p.id, quantity: p.quantity })),
            payment_method: data.payment_method,
            customer_id: selectedCustomer ? selectedCustomer.id : null,
        };
        
        setData(payload); 

        post(route('sales.store'), {
            onSuccess: () => {
                // Logic xử lý sau khi thanh toán thành công
                const remainingCarts = carts.filter(c => c.id !== activeCart);
                
                if (remainingCarts.length === 0) {
                    addNewCart(); 
                } else {
                    setCarts(remainingCarts);
                    setActiveCart(remainingCarts[0].id);
                }
                
                // Hiển thị thông báo thành công
                setSuccessMessage(`Đơn hàng ${activeCart.toString().slice(-4)} đã thanh toán thành công!`); 
                setShowPayModal(false);
                setSelectedCustomer(null);
                
                // Tự động ẩn thông báo sau 3 giây
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        });
    };

    // Mở modal in hóa đơn 
    const handleOpenPrint = () => {
        setShowPrintModal(true);
    };

    const handlePrintInvoice = () => {
        setSuccessMessage("🖨 Hóa đơn đang được in...");
        setShowPrintModal(false);
        setTimeout(() => setSuccessMessage(null), 3000);
    };


    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col p-4">
                <Head title="Trang Bán Hàng" />
                
                {/* Header và Navigation */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-blue-800">🏪 QUẦY POS THỜI TRANG</h1>
                    <div className='flex gap-3 text-sm'>
                        <Link href={route('sales.inventory')} className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-150">
                            📦 Tồn kho
                        </Link>
                        <Link href={route('sales.customers')} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150">
                            👥 Khách hàng
                        </Link>
                        <Link href={route('sales.invoices')} className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-150">
                            📜 Lịch sử HĐ
                        </Link>
                        <Link
                            href="/sales/shifts"
                            className="flex items-center bg-purple-600  text-white px-4 py-2 rounded-lg hover:bg-purple-700transition duration-150"
                        >
                            Ca làm
                        </Link>
                    </div>
                </div>

                {/* Main POS Grid (Hai cột: 3/5 Sản phẩm, 2/5 Giỏ hàng) */}
                <div className="flex-1 grid grid-cols-5 gap-4">
                    
                    {/* Cột trái: Sản phẩm & Danh mục (3/5 width) */}
                    <div className="col-span-3 flex flex-col space-y-4">
                        <div className="bg-white rounded-xl shadow-md p-4 flex-none">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800">Sản phẩm & Danh mục</h2>
                            
                            {/* Thanh tìm kiếm và Filter */}
                            <div className="flex gap-3 mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => setShowCategory(!showCategory)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex-none"
                                >
                                    {showCategory ? "Ẩn danh mục" : "Xem danh mục"}
                                </button>
                            </div>

                            {/* Danh mục */}
                            {showCategory && (
                                <div className='mb-4 flex gap-2 overflow-x-auto pb-2'>
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedCategory === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Tất cả
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedCategory === cat.id ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Danh sách Sản phẩm */}
                        <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto min-h-[500px]">
                            <div className="grid grid-cols-3 gap-4">
                                {filteredProducts.map(product => (
                                    <div 
                                        key={product.id} 
                                        className="bg-gray-100 border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-lg hover:border-blue-400 transition transform hover:-translate-y-0.5"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="text-sm font-semibold text-gray-800 truncate">{product.name}</div>
                                        <div className="text-md font-bold text-red-600">{formatCurrency(product.price)}</div>
                                        <div className="text-xs text-gray-500 mt-1">Kho: {product.stock || 0}</div>
                                        <button className="mt-2 w-full text-xs bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600">
                                            + Thêm
                                        </button>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <p className="col-span-3 text-center text-gray-500 py-10">Không tìm thấy sản phẩm nào.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Giỏ hàng và Thanh toán (2/5 width) */}
                    <div className="col-span-2 flex flex-col space-y-4">
                        
                        {/* Tab Đơn hàng */}
                        <div className='flex gap-1 overflow-x-auto flex-none'>
                            {carts.map(cart => (
                                <div key={cart.id} className="flex items-center flex-none">
                                    <button
                                        onClick={() => switchCart(cart.id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg transition whitespace-nowrap
                                            ${activeCart === cart.id
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                            `}
                                    >
                                        Đơn {cart.id.toString().slice(-4)} ({cart.items.length})
                                    </button>
                                    
                                    <button
                                        // Sử dụng hàm mới để hiển thị modal xác nhận nếu giỏ hàng có items
                                        onClick={() => handleDeleteCartAttempt(cart.id)} 
                                        className={`text-red-600 font-bold px-2 py-2 text-sm rounded-r-lg hover:text-red-800 transition 
                                            ${activeCart === cart.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}
                                            `}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addNewCart}
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition flex-none"
                                title="Thêm đơn hàng mới"
                            >
                                + Đơn mới
                            </button>
                        </div>
                        
                        {/* Thông tin Khách hàng */}
                        <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center flex-none">
                            <h2 className="text-xl font-semibold text-gray-800">Giỏ hàng</h2>
                            <button
                                onClick={() => setShowCustomerModal(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-150 flex items-center gap-1"
                            >
                                {selectedCustomer ? (
                                    <span className='font-semibold'>👤 {selectedCustomer.name}</span>
                                ) : (
                                    <span>Chọn Khách hàng</span>
                                )}
                            </button>
                        </div>

                        {/* Danh sách Sản phẩm trong Giỏ hàng */}
                        <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto min-h-[350px]">
                            {currentCart.items.length > 0 ? (
                                currentCart.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                        <div className='flex-1 pr-2'>
                                            <div className='font-medium text-gray-800'>{item.name}</div>
                                            <div className='text-xs text-gray-500'>{formatCurrency(item.price)}</div>
                                        </div>

                                        <div className='flex items-center space-x-2'>
                                            {/* Quantity controls */}
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                                                className="w-16 text-center border-gray-300 rounded-lg p-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            
                                            {/* Subtotal */}
                                            <span className='w-24 text-right font-semibold text-gray-700 text-sm'>
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                            
                                            {/* Remove button */}
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className='text-red-500 hover:text-red-700 p-1 rounded-full'
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-10">Giỏ hàng rỗng. Hãy thêm sản phẩm!</p>
                            )}
                        </div>

                        {/* Vùng tổng tiền và Thanh toán */}
                        <div className="bg-white rounded-xl shadow-md p-4 flex-none border-t-4 border-blue-600">
                            <div className="flex justify-between text-2xl font-bold text-gray-800 mb-4">
                                <span>TỔNG TIỀN:</span>
                                <span className='text-red-600'>{formatCurrency(total)}</span>
                            </div>

                            <select
                                className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:border-blue-500 focus:ring-blue-500"
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                            >
                                <option value="cash">💵 Tiền mặt</option>
                                <option value="bank">💳 Thẻ</option>
                                <option value="bank">🏦 Chuyển khoản</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleOpenPayment}
                                    disabled={currentCart.items.length === 0 || processing}
                                    className={`flex-1 text-white px-4 py-3 rounded-xl shadow-lg font-bold transition duration-150 ${
                                        currentCart.items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {processing ? 'Đang xử lý...' : 'HOÀN TẤT THANH TOÁN'}
                                </button>

                                <button
                                    onClick={handleOpenPrint}
                                    disabled={currentCart.items.length === 0}
                                    className={`flex-1 text-white px-4 py-3 rounded-xl shadow-lg font-bold transition duration-150 ${
                                        currentCart.items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800'
                                    }`}
                                >
                                    🖨 IN HÓA ĐƠN
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ---------------- MODAL CHỌN KHÁCH HÀNG ---------------- */}
            {showCustomerModal && (
                <CustomModal
                    title="Chọn khách hàng"
                    onClose={() => setShowCustomerModal(false)}
                    actions={
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                            onClick={() => {
                                setSelectedCustomer(null);
                                setShowCustomerModal(false);
                            }}
                        >
                            Khách lẻ (Bỏ chọn)
                        </button>
                    }
                >
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc SĐT..."
                        className="border border-gray-300 rounded-lg w-full p-2 mb-3 focus:border-blue-500 focus:ring-blue-500"
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                    />

                    <div className="h-64 overflow-y-scroll border border-gray-200 rounded-lg">
                        {customers
                            .filter(c =>
                                c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
                                c.phone.includes(searchCustomer)
                            )
                            .map(c => (
                                <div
                                    key={c.id}
                                    className="py-3 px-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                                    onClick={() => {
                                        setSelectedCustomer(c);
                                        setShowCustomerModal(false);
                                    }}
                                >
                                    <div className="font-semibold text-gray-800">{c.name}</div>
                                    <div className="text-sm text-gray-500">{c.phone}</div>
                                </div>
                            ))}
                    </div>
                </CustomModal>
            )}

            {/* ---------------- MODAL XÁC NHẬN THANH TOÁN ---------------- */}
            {showPayModal && (
                <CustomModal
                    title="Hoàn tất Giao dịch"
                    onClose={() => setShowPayModal(false)}
                    actions={
                        <>
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setShowPayModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${customerMoney < total ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleConfirmPayment}
                                disabled={processing || customerMoney < total}
                            >
                                Hoàn tất ({formatCurrency(total)})
                            </button>
                        </>
                    }
                >
                    <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between text-base font-medium mb-1">
                            <span>Khách hàng:</span>
                            <span>{selectedCustomer ? selectedCustomer.name : 'Khách lẻ'}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-800">
                            <span>TỔNG CỘNG:</span>
                            <span className='text-red-600'>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <label className="block font-medium mb-1 text-gray-700">Tiền khách đưa:</label>
                    <input
                        type="number"
                        value={customerMoney}
                        onChange={(e) => handleMoneyInput(e.target.value)}
                        className="border border-gray-300 rounded-lg w-full p-3 text-lg mb-3 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={total.toString()}
                    />

                    <div className="flex justify-between text-2xl font-bold mb-2">
                        <span>Tiền thừa:</span>
                        <span className={`${changeMoney >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(changeMoney)}
                        </span>
                    </div>
                    {customerMoney !== '' && Number(customerMoney) < total && (
                           <p className="text-red-500 text-sm mt-1">⚠️ Số tiền khách đưa không đủ.</p>
                    )}
                </CustomModal>
            )}

            {/* ---------------- MODAL XÁC NHẬN XÓA GIỎ HÀNG ---------------- */}
            {showDeleteConfirmationModal && (
                <CustomModal
                    title="Xác nhận xóa đơn hàng"
                    onClose={() => setShowDeleteConfirmationModal(false)}
                    actions={
                        <>
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setShowDeleteConfirmationModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                                onClick={() => handleDeleteCart(cartToDeleteId)}
                            >
                                Xác nhận Xóa
                            </button>
                        </>
                    }
                >
                    <p>Đơn hàng này đang có **{carts.find(c => c.id === cartToDeleteId)?.items.length} sản phẩm**. Bạn có chắc chắn muốn xóa đơn hàng **Đơn {cartToDeleteId?.toString().slice(-4)}** không?</p>
                </CustomModal>
            )}

            {/* ---------------- MODAL IN HÓA ĐƠN ---------------- */}
            {showPrintModal && (
                <CustomModal
                    title="In Hóa đơn Tạm tính"
                    onClose={() => setShowPrintModal(false)}
                    actions={
                        <>
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setShowPrintModal(false)}
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handlePrintInvoice}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                            >
                                🖨 In hóa đơn
                            </button>
                        </>
                    }
                >
                    <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
                        <p className='text-center font-bold text-lg mb-2'>--- HÓA ĐƠN TẠM TÍNH ---</p>
                        {currentCart.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm py-1">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <hr className="my-2 border-gray-300" />
                        <div className="flex justify-between font-bold text-lg text-gray-800">
                            <span>TỔNG CỘNG:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        {selectedCustomer && (
                            <div className='mt-2 text-xs text-gray-600'>KH: {selectedCustomer.name} - {selectedCustomer.phone}</div>
                        )}
                    </div>
                </CustomModal>
            )}

            {/* Toast/Success Message */}
            {successMessage && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
                    {successMessage}
                </div>
            )}

        </AuthenticatedLayout>
    );
}