import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SalesDashboard({ products, categories, customers }) {
    //Quan ly nhieu don hang
    const [carts, setCarts] = useState([
        {id: 1, items: []}
    ]);
    const [activeCart, setActiveCart] = useState(1);
    const currentCart = carts.find(c => c.id === activeCart);
    const switchCart = (id) => setActiveCart(id);
    const addNewCart = () =>{
        const newId = Date.now();
        setCarts([...carts, {id: newId, items: []}]);
        setActiveCart(newId);
    };
    const updateCartItems = (items) =>{
        setCarts(carts.map(c =>
            c.id === activeCart ? {...c, items} :c
        ));
    }
    const handleDeleteCart = (id) => {
        const cartToDelete = carts.find(c => c.id ===id);

        if(!cartToDelete) return;

        if(cartToDelete.items.length >0){
            if(!confirm("Đơn hàng này đang có sản phẩm. Bạn có chắc muốn xóa?")){
                return;
            }
        }
        const updated = carts.filter(c =>c.id !==id);

        if(id === activeCart){
            if(updated.length ===0 ){
                const newId = Date.now();
                setCarts([{ id: newId, items: []}]);
                setActiveCart(newId);
            }else{
                setActiveCart(updated[0].id);
            }
        }
        setCarts(updated);
    }

    //khach hang
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [searchCustomer, setSearchCustomer] = useState('');

    const [showCategory, setShowCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [showPayModal, setShowPayModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [customerMoney, setCustomerMoney] = useState('');
    const [changeMoney, setChangeMoney] = useState(0);

    const { data, setData, post, processing } = useForm({
        items: [],
        payment_method: 'cash',
    });

    

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter((p) => p.category_id === selectedCategory);

    const addToCart = (product) => {
        const existing = currentCart.items.find((p) => p.id === product.id);
        let updated;

        if (existing) {
            updated = currentCart.items.map((p) =>
                p.id === product.id ? {...p, quantity:p.quantity +1} : p
            );
        } else {
            updated = [...currentCart.items, {...product, quantity: 1}];
        }

        updateCartItems(updated);
    };

    const updateQty = (id, qty) => {
       updateCartItems(
        currentCart.items.map(p =>
            p.id === id ? {...p, quantity:qty} : p
        )
       );
    };

    const total = currentCart.items.reduce((sum,p) => sum + p.price * p.quantity, 0);

    // Mở modal thanh toán
    const handleOpenPayment = () => {
        setCustomerMoney('');
        setChangeMoney(0);
        setShowPayModal(true);
    };

    // Tính tiền thừa
    const handleMoneyInput = (val) => {
        setCustomerMoney(val);
        setChangeMoney(Number(val) - total);
    };

    // Xác nhận thanh toán
    const handleConfirmPayment = () => {
        setData({
            items: currentCart.items.map(p => ({ id: p.id, quantity: p.quantity })),
            payment_method: data.payment_method,
            customer_id: selectedCustomer ? selectedCustomer.id :null,
        });

        post(route('sales.store'), {
            onSuccess: () => {
                alert("Thanh toán thành công!");
                //xoa don thanh cong
                setCarts(carts.filter(c => c.id !== activeCart));

                //chuyen don con lai(neu co)
                if(carts.length >1){
                    setActiveCart(carts[0].id);
                }else{
                    addNewCart();
                }

                setShowPayModal(false);
            }
        });
    };

    // Mở modal in hóa đơn 
    const handleOpenPrint = () => {
        setShowPrintModal(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <Head title="Trang Bán Hàng" />

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">🛒 Bán hàng</h1>
                    <div className='flex gap-2'>
                    <Link
                        href={route('sales.inventory')}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        📦 Tồn kho
                    </Link>

                    <Link
                        href={route('sales.customers')}
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        👥 Khách hàng
                    </Link>

                    <Link
                        href={route('sales.invoices')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                        📜 Lịch sử hóa đơn

                    </Link>

                    </div>
                    
                </div>

                <div className="grid grid-cols-2 gap-4 ">
                    {/* Cột trái */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
                            <button
                                onClick={() => setShowCategory(!showCategory)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {showCategory ? "Ẩn danh mục" : "Xem danh mục"}
                            </button>
                        </div>

                        {showCategory && (
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(
                                        e.target.value === 'all' ? 'all' : parseInt(e.target.value)
                                    )
                                }
                                className="border p-2 rounded w-full mb-3"
                            >
                                <option value="all">Tất cả</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        )}

                        <div className="border rounded p-2 h-96 overflow-y-scroll">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="flex justify-between border-b py-1">
                                    <span>{product.name}</span>
                                    <button
                                        className="text-blue-600"
                                        onClick={() => addToCart(product)}
                                    >
                                        + Thêm
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div>
                        <div className='flex gap-2 mb-2'>
                            {carts.map(cart => (
                                <div key={cart.id} className="flex items-center ">
                                    <button 
                                        onClick={()=> switchCart(cart.id)}
                                        className={`px-3 py-1 rounded-l
                                            ${activeCart === carts.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400'}
                                            `}
                                    >
                                        Đơn {cart.id.toString().slice(-4)}
                                    </button>
                                    
                                    <button 
                                        onClick={()=> handleDeleteCart(cart.id)}
                                        className="text-red-600 font-bold px-1 py-1 rounded-r hover:text-red-800 bg-gray-300 hover:bg-gray-400"
                                    >
                                        x
                                    </button>

                                </div>
                            ))}
                            <button
                                onClick={addNewCart}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                +
                            </button>
                        </div>

                        <h2 className="text-xl mb-2 font-semibold">Giỏ hàng</h2>
                        
                        <div className="mb-3">
                            <button
                                onClick={() => setShowCustomerModal(true)}
                                className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                {selectedCustomer ? `👤 ${selectedCustomer.name}` : "Chọn khách hàng"}
                            </button>
                        </div>
                        <div className="border rounded p-2 h-96 overflow-y-scroll">
                            {currentCart.items.map(item => (
                                <div key={item.id} className="flex justify-between py-1 border-b">
                                    <span>{item.name}</span>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                                        className="w-16 text-center border rounded"
                                    />
                                    <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                                </div>
                            ))}
                            
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Tổng:</span>
                                <span>{total.toLocaleString()}₫</span>
                            </div>

                            <select
                                className="border rounded p-2 w-full mt-3"
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                            >
                                <option value="cash">Tiền mặt</option>
                                <option value="card">Thẻ</option>
                                <option value="bank">Chuyển khoản</option>
                            </select>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleOpenPayment}
                                    disabled={currentCart.items.length === 0}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Thanh toán
                                </button>

                                <button
                                    onClick={handleOpenPrint}
                                    disabled={currentCart.items.length === 0}
                                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                                >
                                    In hóa đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- MODAL THANH TOÁN ---------------- */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-3">Xác nhận thanh toán</h2>

                        <div className="border p-3 rounded mb-3">
                            {currentCart.items.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                                </div>
                            ))}

                            <hr className="my-2" />
                            <div className="flex justify-between font-semibold">
                                <span>Tổng tiền:</span>
                                <span>{total.toLocaleString()}₫</span>
                            </div>
                        </div>

                        <label className="block font-medium mb-1">Tiền khách đưa:</label>
                        <input
                            type="number"
                            value={customerMoney}
                            onChange={(e) => handleMoneyInput(e.target.value)}
                            className="border rounded w-full p-2 mb-2"
                        />

                        <div className="flex justify-between text-green-700 font-semibold mb-4">
                            <span>Tiền thừa:</span>
                            <span>{changeMoney.toLocaleString()}₫</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="flex-1 bg-gray-400 text-white py-2 rounded"
                                onClick={() => setShowPayModal(false)}
                            >
                                Hủy
                            </button>

                            <button
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                onClick={handleConfirmPayment}
                                disabled={processing}
                            >
                                Hoàn tất thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- MODAL IN HÓA ĐƠN ---------------- */}
            {showPrintModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-3">Hóa đơn</h2>

                        <div className="border p-3 rounded mb-4">
                            {currentCart.items.map(item => (
                                <div key={item.id} className="flex justify-between py-1">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                                </div>
                            ))}

                            <hr className="my-2" />

                            <div className="flex justify-between font-semibold text-lg">
                                <span>Tổng tiền:</span>
                                <span>{total.toLocaleString()}₫</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="flex-1 bg-gray-400 text-white py-2 rounded"
                                onClick={() => setShowPrintModal(false)}
                            >
                                Đóng
                            </button>

                            <button
                                onClick={() => {
                                    alert("🖨 Hóa đơn đang được in…");
                                    setShowPrintModal(false);
                                }}
                                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                In hóa đơn
                            </button>
                        </div>
                    </div>
                </div>
            )}
             {/* MODAL CHON KHACH HANG */}
             {showCustomerModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

                        <h2 className="text-xl font-bold mb-3">Chọn khách hàng</h2>

                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc số điện thoại..."
                            className="border p-2 rounded w-full mb-3"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                        />

                        <div className="h-64 overflow-y-scroll border rounded p-2">
                            {customers
                                .filter(c =>
                                    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
                                    c.phone.includes(searchCustomer)
                                )
                                .map(c => (
                                    <div
                                        key={c.id}
                                        className="py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedCustomer(c);
                                            setShowCustomerModal(false);
                                        }}
                                    >
                                        <div className="font-semibold">{c.name}</div>
                                        <div className="text-sm text-gray-600">{c.phone}</div>
                                    </div>
                                ))}
                        </div>

                        <button
                            className="mt-3 w-full bg-gray-500 text-white py-2 rounded"
                            onClick={() => setShowCustomerModal(false)}
                        >
                            Đóng
                        </button>

                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
