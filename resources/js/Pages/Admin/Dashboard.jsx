import React from "react";
import { Head } from "@inertiajs/react";

export default function Dashboard(){
    return(
        <>
            <Head title="Trang quản lý"/>
            <div className="p-6 text-gray-900">
                <h1 className="text-2x1 font-bold">Trang quản lý (Admin)</h1>
                <p>Quản lý doanh thu, hàng hoá, đơn hàng, nhân viên...</p>
            </div>

        </>
    )
}