import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import TimeClock from '@/Components/TimeClock';

export default function AuthenticatedLayout({ children }) {
  const { auth } = usePage().props;
  const [open, setOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout')); // Gọi route logout Laravel
  };

  const dashboardRoute = auth.user.role === 'admin' 
    ? route('admin.welcome') // Route cho Admin
    : route('sales.dashboard');

  const displayText = auth.user.role === 'admin' 
    ? 'Trang Quản Trị' 
    : 'Bán Hàng';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          
          <Link 
            href={dashboardRoute} 
            className="text-lg font-semibold text-gray-800 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            {displayText}
          </Link>
           <div className="flex items-center gap-4">
                    <TimeClock/>
                   
            </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-gray-700 font-medium">{auth.user.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
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
         
        </div>
      </header>

      {/* Nội dung trang */}
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
