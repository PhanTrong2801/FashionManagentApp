import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Inventory({ categories }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <Head title="Tồn kho" />
                <h1 className="text-2xl font-bold mb-4">📦 Quản lý kho</h1>

                <div className="flex gap-4">
                    {/* Danh mục */}
                    <div className="w-1/3 border rounded p-3 h-96 overflow-y-auto">
                        <h2 className="font-semibold mb-2">Danh mục</h2>
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`p-2 cursor-pointer rounded ${
                                    selectedCategory?.id === cat.id
                                        ? 'bg-blue-100 font-semibold'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {cat.name}
                            </div>
                        ))}
                    </div>

                    {/* Sản phẩm thuộc danh mục */}
                    <div className="flex-1 border rounded p-3 h-96 overflow-y-auto">
                        <h2 className="font-semibold mb-2">
                            {selectedCategory
                                ? `Sản phẩm trong: ${selectedCategory.name}`
                                : 'Chọn danh mục để xem sản phẩm'}
                        </h2>

                        {selectedCategory && selectedCategory.products.length > 0 ? (
                            selectedCategory.products.map(p => (
                                <div key={p.id} className="flex justify-between border-b py-1">
                                    <span>{p.name}</span>
                                    <span>{p.stock} cái</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Không có sản phẩm.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
