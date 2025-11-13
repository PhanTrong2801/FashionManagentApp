import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SalesDashboard({ products, categories }) {
    const [cart, setCart] = useState([]);
    const [showCategory, setShowCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const { data, setData, post, processing } = useForm({
        items: [],
        payment_method: 'cash',
    });

    // --- Lọc sản phẩm theo danh mục ---
    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter((p) => p.category_id === selectedCategory);

    // --- Thêm vào giỏ ---
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

    const handleSubmit = () => {
        setData({
            items: cart.map(p => ({ id: p.id, quantity: p.quantity })),
            payment_method: data.payment_method,
        });
        post(route('sales.store'));
    };

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <Head title="Trang Bán Hàng" />

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">🛒 Bán hàng</h1>

                    {/* 👉 Nút Tồn kho */}
                    <Link
                        href={route('sales.inventory')}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        📦 Tồn kho
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Cột trái: sản phẩm */}
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

                        {/* Danh mục lọc */}
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

                        {/* Danh sách sản phẩm */}
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

                    {/* Cột phải: giỏ hàng */}
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

                            <button
                                onClick={handleSubmit}
                                disabled={processing || cart.length === 0}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
