import React, {useState} from 'react';
import { Head, useForm  } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function SalesDashboard({ products }) {
    const [cart, setCart] = useState([]);
    const { data, setData, post, processing } = useForm({
        items: [],
        payment_method: 'cash',
    });

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
            <h1 className="text-2xl font-bold mb-4">🛒 Bán hàng</h1>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl mb-2 font-semibold">Danh sách sản phẩm</h2>
                    <div className="border rounded p-2 h-96 overflow-y-scroll">
                        {products.map((product) => (
                            <div key={product.id}
                                className="flex justify-between border-b py-1">
                                <span>{product.name}</span>
                                <button
                                    className="text-blue-600"
                                    onClick={() => addToCart(product)}>
                                    + Thêm
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

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
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
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