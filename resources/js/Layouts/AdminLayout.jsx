import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react"; // 1. Thêm router

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    
    // State cho Sidebar
    const [open, setOpen] = useState(true);
    
    // 2. State cho User Dropdown (Mới)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    // 3. Hàm xử lý đăng xuất
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };
    

    return (
        <div className="flex bg-gray-100 min-h-screen">

            {/* ========== SIDEBAR ========== */}
            <div className={`bg-white shadow-lg transition-all ${open ? "w-64" : "w-20"} duration-300`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h1 className={`text-xl font-bold text-blue-600 transition-all ${open ? "opacity-100" : "opacity-0 w-0"}`}>
                        QUẢN TRỊ
                    </h1>
                    <button onClick={() => setOpen(!open)} className="text-gray-600">
                        {open ? "⮜" : "⮞"}
                    </button>
                </div>

                <nav className="mt-4">
                    <Link href={route('admin.dashboard')} className="flex items-center p-3 hover:bg-gray-100">
                        📊 <span className={`ml-3 ${!open && "hidden"}`}>Dashboard</span>
                    </Link>

                    <Link href="/admin/shifts" className="flex items-center p-3 hover:bg-gray-100">
                        🕒 <span className={`ml-3 ${!open && "hidden"}`}>Ca làm</span>
                    </Link>

                    <Link href={route('admin.products')} className="flex items-center p-3 hover:bg-gray-100">
                        🛍 <span className={`ml-3 ${!open && "hidden"}`}>Sản phẩm</span>
                    </Link>

                    
                    <Link 
                        href={route('admin.orders.index')} 
                        className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${route().current('admin.orders.*') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700'}`}
                    >
                        🧾 <span className={`ml-3 ${!open && "hidden"}`}>Hóa đơn</span>
                    </Link>

                    <Link 
                        href={route('admin.customers.index')} 
                        className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${route().current('admin.customers.*') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700'}`}
                    >
                        💎 <span className={`ml-3 ${!open && "hidden"}`}>Khách hàng</span>
                    </Link>

                    <Link href={route('admin.users.index')} className="flex items-center p-3 hover:bg-gray-100">
                        👥 <span className={`ml-3 ${!open && "hidden"}`}>Nhân viên</span>
                    </Link>
                    <Link 
                        href={route('admin.payroll.index')} 
                        className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${route().current('admin.payroll.*') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700'}`}
                    >
                        💸 <span className={`ml-3 ${!open && "hidden"}`}>Bảng lương</span>
                    </Link>
                    <Link 
                        href={route('admin.reports.index')} 
                        className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${route().current('admin.reports.*') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700'}`}
                    >
                        📈 <span className={`ml-3 ${!open && "hidden"}`}>Báo cáo</span>
                    </Link>

                    <Link 
                        href={route('admin.suppliers.index')} 
                        className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${route().current('admin.suppliers.*') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700'}`}
                    >
                        🏭 <span className={`ml-3 ${!open && "hidden"}`}>Nhà cung cấp</span>
                    </Link>
                </nav>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div className="flex-1">
                {/* HEADER */}
                <header className="bg-white shadow px-5 py-1 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Hệ thống quản trị bán hàng</h2>

                    {/* 4. User Dropdown Area */}
                    <div className="relative">
                        <button 
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition"
                        >
                            <div className="text-right hidden sm:block"> 
                                <p className="font-semibold">{auth.user.name}</p>
                                <p className="text-sm text-gray-500">{auth.user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                                👤
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Hồ sơ cá nhân
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* CONTENT */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}