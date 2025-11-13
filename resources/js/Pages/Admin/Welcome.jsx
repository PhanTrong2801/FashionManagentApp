import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function AdminWelcome() {
    return (
        // Thêm lớp bg-gradient-to-br với màu sắc nhẹ nhàng và hiệu ứng animate-gradient
        <div className="relative flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient">
            <Head title="Xin chào Admin" />

            {/* Logo placeholder - giữ nguyên */}
            {/* <div>
                 <Link href="/">
                    <YourLogoComponent className="w-20 h-20" />
                 </Link>
            </div> */}

            <div className="w-full p-6 mt-6 overflow-hidden text-center bg-white shadow-md sm:max-w-md sm:rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    👑 Xin Chào, Admin!
                </h1>
                <p className="text-gray-600 mb-8">
                    Chọn một hành động bên dưới để bắt đầu:
                </p>

                <div className="flex flex-col gap-4">
                    {/* Nút 1 (Hành động chính) với hiệu ứng động */}
                    <Link
                        href="/admin/create-user"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                                   font-semibold transition duration-200 ease-in-out
                                   transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        ➕ Tạo nhân viên mới
                    </Link>

                    {/* Nút 2 (Hành động phụ) với hiệu ứng động */}
                    <Link
                        href="/admin/dashboard"
                        className="w-full bg-white hover:bg-gray-100 text-blue-700 px-6 py-3 rounded-lg
                                   font-semibold transition duration-200 ease-in-out
                                   transform hover:scale-105 active:scale-95 border border-blue-600
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        📊 Vào trang quản lý bán hàng
                    </Link>
                </div>
            </div>
        </div>
    );
}