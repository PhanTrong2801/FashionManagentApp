import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    
    // State cho Sidebar
    const [open, setOpen] = useState(true);
    
    // State cho User Dropdown
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    // Hàm xử lý đăng xuất
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };


    const getItemClass = (isActive) => {
        return `flex items-center p-3 transition-colors duration-200 ${
            isActive 
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium" // Style khi Active
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"             // Style thường + Hover
        }`;
    };

    return (
        <div className="flex bg-gray-100 min-h-screen font-sans">

            {/* ========== SIDEBAR ========== */}
            <div className={`bg-white shadow-lg transition-all ${open ? "w-64" : "w-20"} duration-300 flex flex-col`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    <h1 className={`text-xl font-bold text-blue-600 transition-all whitespace-nowrap overflow-hidden ${open ? "opacity-100" : "opacity-0 w-0"}`}>
                        QUẢN TRỊ
                    </h1>
                    <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
                        {open ? "⮜" : "⮞"}
                    </button>
                </div>

                <nav className="mt-4 flex-1 overflow-y-auto">
                    
                    <Link 
                        href={route('admin.dashboard')} 
                        className={getItemClass(route().current('admin.dashboard'))}
                    >
                        📊 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Dashboard</span>
                    </Link>

                    <Link 
                        href="/admin/shifts" 
                        className={getItemClass(window.location.pathname.startsWith('/admin/shifts'))}
                    >
                        🕒 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Ca làm</span>
                    </Link>

                    <Link 
                        href={route('admin.products')} 
                        className={getItemClass(route().current('admin.products*'))}
                    >
                        🛍 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Sản phẩm</span>
                    </Link>

                    <Link 
                        href={route('admin.orders.index')} 
                        className={getItemClass(route().current('admin.orders.*'))}
                    >
                        🧾 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Hóa đơn</span>
                    </Link>


                    <Link 
                        href={route('admin.customers.index')} 
                        className={getItemClass(route().current('admin.customers.*'))}
                    >
                        💎 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Khách hàng</span>
                    </Link>

                    <Link 
                        href={route('admin.users.index')} 
                        className={getItemClass(route().current('admin.users.*'))}
                    >
                        👥 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Nhân viên</span>
                    </Link>

                    <Link 
                        href={route('admin.payroll.index')} 
                        className={getItemClass(route().current('admin.payroll.*'))}
                    >
                        💸 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Bảng lương</span>
                    </Link>

                    <Link 
                        href={route('admin.reports.index')} 
                        className={getItemClass(route().current('admin.reports.*'))}
                    >
                        📈 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Báo cáo</span>
                    </Link>

                    <Link 
                        href={route('admin.suppliers.index')} 
                        className={getItemClass(route().current('admin.suppliers.*'))}
                    >
                        🏭 <span className={`ml-3 whitespace-nowrap ${!open && "hidden"}`}>Nhà cung cấp</span>
                    </Link>
                </nav>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">Hệ thống quản trị bán hàng</h2>

                    {/* User Dropdown Area */}
                    <div className="relative">
                        <button 
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                        >
                            <div className="text-right hidden sm:block"> 
                                <p className="font-semibold text-gray-800 text-sm">{auth.user.name}</p>
                                <p className="text-xs text-gray-500">{auth.user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg border border-blue-200">
                                👤
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                    <p className="font-semibold text-gray-800">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}