import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function TimeClock() {
    // Lấy biến is_working từ Middleware vừa thêm
    const { auth } = usePage().props;
    const isWorking = auth.is_working; 
    
    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);

    // Hiệu ứng đếm giây ảo (cho vui mắt khi đang làm việc)
    useEffect(() => {
        let interval = null;
        if (isWorking) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isWorking]);

    const handleToggle = () => {
        const action = isWorking ? "KẾT THÚC" : "BẮT ĐẦU";
        
        // 1. Hỏi xác nhận
        if (!confirm(`Bạn có chắc chắn muốn ${action} ca làm việc không?`)) return;

        setLoading(true);

        // 2. Gửi request
        router.post(route('attendance.toggle'), {}, {
            onFinish: () => {
                setLoading(false);
                // Sau khi xong, Inertia tự reload và cập nhật lại biến isWorking
            },
            onSuccess: () => {
                // Có thể thêm Toast/Alert đẹp ở đây nếu muốn
                alert(isWorking ? "Đã chốt giờ về thành công! 👋" : "Đã chấm công vào làm! 💪");
            }
        });
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={loading}
            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105
                ${loading ? 'opacity-70 cursor-wait' : ''}
                ${isWorking 
                    ? 'bg-red-100 text-red-700 border-2 border-red-500 hover:bg-red-200' // Style khi ĐANG LÀM
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-400' // Style khi RẢNH
                }
            `}
        >
            {/* Icon thay đổi */}
            <span className={`text-xl ${isWorking ? 'animate-pulse' : ''}`}>
                {isWorking ? '⏳' : '👆'}
            </span>

            <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-bold uppercase tracking-wide">
                    {isWorking ? 'Đang làm việc' : 'Chấm công'}
                </span>
                
                {/* Trạng thái phụ */}
                <span className="text-[10px] opacity-80 font-mono mt-0.5">
                    {isWorking ? 'Bấm để tan ca' : 'Bấm để vào ca'}
                </span>
            </div>

            {/* Chấm tròn trạng thái (Đèn tín hiệu) */}
            <span className="relative flex h-3 w-3 ml-1">
                {isWorking ? (
                    <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </>
                ) : (
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
                )}
            </span>
        </button>
    );
}