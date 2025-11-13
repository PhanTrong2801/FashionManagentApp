import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SalesDashboard({ products, categories }) {
    const [cart, setCart] = useState([]);
    const [showCategory, setShowCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showInvoice, setShowInvoice] = useState(false);
    const [cashGiven, setCashGiven] = useState('');

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
    const change = cashGiven ? cashGiven - total : 0;

    const handleSubmit = () => {
        setData({
            items: cart.map(p => ({ id: p.id, quantity: p.quantity })),
            payment_method: data.payment_method,
        });
        post(route('sales.store'));
        setShowInvoice(false);
        alert('💰 Thanh toán hoàn tất!');
        setCart([]);
        setCashGiven('');
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6 relative">
                <Head title="Trang Bán Hàng" />

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">🛒 Bán hàng</h1>

                    <Link
                        href={route('sales.inventory')}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        📦 Tồn kho
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Danh sách sản phẩm */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
                            <button
                                onClick={() => setShowCategory(!showCategory)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                {showCategory ? "Ẩn danh mục" : "Xem danh mục"}
                            </button>
                        </div>

                        {showCategory && (
                            <div className="mb-3">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(
                                            e.target.value === 'all'
                                                ? 'all'
                                                : parseInt(e.target.value)
                                        )
                                    }
                                    className="border p-2 rounded w-full"
                                >
                                    <option value="all">Tất cả danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="border rounded p-2 h-96 overflow-y-scroll">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex justify-between border-b py-1"
                                    >
                                        <span>{product.name}</span>
                                        <button
                                            className="text-blue-600"
                                            onClick={() => addToCart(product)}
                                        >
                                            + Thêm
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">
                                    Không có sản phẩm trong danh mục này
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Giỏ hàng */}
                    <div>
                        <h2 className="text-xl mb-2 font-semibold">Giỏ hàng</h2>
                        <div className="border rounded p-2 h-96 overflow-y-scroll">
                            {cart.map((item) => (
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

                        {/* Tổng cộng & thanh toán */}
                        <div className="mt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Tổng:</span>
                                <span>{total.toLocaleString()}₫</span>
                            </div>

                            <div className="mt-3">
                                <select
                                    className="border rounded p-2 w-full"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                >
                                    <option value="cash">Tiền mặt</option>
                                    <option value="card">Thẻ</option>
                                    <option value="bank">Chuyển khoản</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowInvoice(true)}
                                    disabled={cart.length === 0}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Thanh toán
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    🧾 In hóa đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Modal Phiếu thanh toán --- */}
                {showInvoice && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-center">💵 Phiếu thanh toán</h2>

                            <div className="mb-3 border-b pb-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right font-semibold mb-3">
                                Tổng cộng: {total.toLocaleString()}₫
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">💰 Tiền khách đưa:</label>
                                <input
                                    type="number"
                                    value={cashGiven}
                                    onChange={(e) => setCashGiven(e.target.value)}
                                    className="w-full border rounded p-2"
                                    placeholder="Nhập số tiền khách đưa"
                                />
                            </div>

                            <div className="text-right mb-4 font-semibold text-green-700">
                                Tiền thừa: {change >= 0 ? change.toLocaleString() + '₫' : '---'}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowInvoice(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing || change < 0}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Xác nhận thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
