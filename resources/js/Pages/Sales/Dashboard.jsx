import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SalesDashboard({ products, categories }) {
    const [cart, setCart] = useState([]);
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
        const existing = cart.find((p) => p.id === product.id);
        if (existing) {
            setCart(cart.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQty = (id, qty) => {
        setCart(cart.map(p => p.id === id ? { ...p, quantity: qty } : p));
    };

    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

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
            items: cart.map(p => ({ id: p.id, quantity: p.quantity })),
            payment_method: data.payment_method,
        });

        post(route('sales.store'), {
            onSuccess: () => {
                alert("Thanh toán thành công!");
                setShowPayModal(false);
                setCart([]);
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
                    <div className='flex '>
                        <Link
                        href={route('sales.inventory')}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        📦 Tồn kho
                    </Link>

                    <Link
                        href={route('sales.invoices')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                        📜 Lịch sử hóa đơn

                    </Link>

                    </div>
                    
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <h2 className="text-xl mb-2 font-semibold">Giỏ hàng</h2>
                        <div className="border rounded p-2 h-96 overflow-y-scroll">
                            {cart.map(item => (
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
                                    disabled={cart.length === 0}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Thanh toán
                                </button>

                                <button
                                    onClick={handleOpenPrint}
                                    disabled={cart.length === 0}
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
                            {cart.map(item => (
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
                            {cart.map(item => (
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
        </AuthenticatedLayout>
    );
}
