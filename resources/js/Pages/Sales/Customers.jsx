import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";



const CustomModal = ({ title, children, actions, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100" 
            onClick={(e) => e.stopPropagation()} 
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>
            <div>{children}</div>
            <div className="flex justify-end gap-3 pt-4 mt-4">
                {actions}
            </div>
        </div>
    </div>
);

// Hàm trả về class màu cho hạng khách hàng 
const getRankClass = (rank) => {
    switch (rank) {
        case "Diamond":
            return "text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full text-xs font-bold";
        case "Gold":
            return "text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full text-xs font-bold";
        case "Silver":
            return "text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full text-xs font-bold";
        default:
            return "text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs";
    }
};




export default function Customers({ customers: initialCustomers, search: initialSearch }) {

  
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

   
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null);

   
    const { data, setData, post, processing, reset } = useForm({
        name: "",
        phone: "",
        address: "",
    });

    

    const openEditModal = (customer) =>{
        setEditingCustomer(customer);
        setData({
            name: customer.name,
            phone: customer.phone,
            address: customer.address, 
        });
        setEditModal(true);
    }
    
    
    const deleteCustomerAttempt = (customer) => {
        setCustomerToDelete(customer);
        setDeleteConfirmationModal(true);
    }
    
   
    const deleteCustomer = (customer) =>{
        
        const finalCustomer = customer || customerToDelete;
        if (!finalCustomer) return;

        router.delete(route("sales.customers.destroy", finalCustomer.id), {
            onSuccess: ()=> {
                setSuccessMessage(`Đã xoá khách hàng ${finalCustomer.name} thành công!`);
                setTimeout(() => setSuccessMessage(null), 3000);
            },
            onError: (err) => {
                setSuccessMessage(err.error ?? "Không thể xoá khách hàng!");
                setTimeout(() => setSuccessMessage(null), 3000);
            },
            onFinish: () => {
                setDeleteConfirmationModal(false);
                setCustomerToDelete(null);
            }
        });
    }

    
    const handleUpdate = (e) =>{
        e.preventDefault();

        router.put(
            route("sales.customers.update", editingCustomer.id),
            data,
            {
                onSuccess: ()=>{
                    setSuccessMessage("Cập nhật khách hàng thành công!");
                    setTimeout(() => setSuccessMessage(null), 3000);
                    setEditModal(false);
                }
            }
        )
    }

    // [MODIFIED LOGIC] Thay thế alert() bằng toast
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sales.customers.store"), {
            onSuccess: () => {
                setSuccessMessage("Đã thêm khách hàng thành công!");
                setTimeout(() => setSuccessMessage(null), 3000);
                reset();
                setShowModal(false);
            }
        });
    };

    const handleSearch = (e) => {
        router.get("/sales/customers", { search: e.target.value }, { preserveState: true });
    };


    return (
        <AuthenticatedLayout>
            <Head title="Khách hàng" />

            <div className="min-h-screen bg-gray-50 p-6">
                
                {/* Header Section (GIAO DIỆN MỚI) */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md">
                    <h1 className="text-3xl font-extrabold text-blue-800">👥 QUẢN LÝ KHÁCH HÀNG</h1>
                    <div className='flex gap-3 text-sm'>
                        {/* Link quay lại trang POS */}
                        <Link
                            href={route('sales.dashboard')}
                            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                        >
                            🛒 Quay lại Bán hàng
                        </Link>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    {/* Input tìm kiếm (GIAO DIỆN MỚI) */}
                    <input
                        type="text"
                        placeholder="🔍 Tìm khách hàng theo tên hoặc số điện thoại..."
                        defaultValue={initialSearch}
                        onChange={handleSearch}
                        className="border border-gray-300 rounded-lg shadow-sm px-4 py-2 w-full max-w-md focus:border-blue-500 focus:ring-blue-500 transition"
                    />

                    {/* Button thêm khách hàng (GIAO DIỆN MỚI) */}
                    <button
                        onClick={() =>{
                            reset();
                            setShowModal(true);}
                        }
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700 font-semibold transition transform hover:-translate-y-0.5"
                    >
                        ➕ Thêm khách hàng mới
                    </button>
                </div>

                {/* Bảng Khách hàng (GIAO DIỆN MỚI) */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-white shadow-md">
                                <th className="p-4 w-1/5">Tên Khách hàng</th>
                                <th className="p-4 w-1/6">SĐT</th>
                                <th className="p-4 w-2/5">Địa chỉ</th>
                                <th className="p-4 w-1/12 text-center">Điểm</th>
                                <th className="p-4 w-1/12 text-center">Hạng</th>
                                <th className="p-4 w-1/6 text-center">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            
                            {initialCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500 text-lg">
                                        Không có khách hàng nào được tìm thấy.
                                    </td>
                                </tr>
                            ) : (
                                initialCustomers.map((c, index) => (
                                    <tr 
                                        key={c.id}
                                        className={`hover:bg-blue-50 transition ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
                                    >
                                        <td className="p-4 font-medium text-gray-800">{c.name}</td>
                                        <td className="p-4 text-gray-600">{c.phone}</td>
                                        <td className="p-4 text-gray-600 truncate max-w-xs">{c.address}</td>
                                        <td className="p-4 text-center font-semibold text-green-700">{c.points || 0}</td>
                                        <td className="p-4 text-center">
                                            <span className={getRankClass(c.rank)}>
                                                {c.rank || "Member"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm transition"
                                                    onClick={() => openEditModal(c)}
                                                >
                                                    ✏️ Sửa
                                                </button>

                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"

                                                    onClick={() => deleteCustomerAttempt(c)} 
                                                >
                                                    🗑️ Xóa
                                                </button>

                                                <Link
                                                    href={route("sales.customers.history", c.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition"
                                                >
                                                    📜 Lịch sử
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal thêm khách hàng */}
            {showModal && (
                <CustomModal
                    title="Thêm Khách hàng Mới"
                    onClose={() => setShowModal(false)}
                    actions={
                        <>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                form="customer-add-form"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                disabled={processing}
                            >
                                {processing ? 'Đang lưu...' : '➕ Lưu Khách hàng'}
                            </button>
                        </>
                    }
                >
                    <form id="customer-add-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Khách hàng (*)</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại (*)</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                            />
                        </div>
                    </form>
                </CustomModal>
            )}

            {/* Modal Sửa Khách Hàng  */}
            {editModal && editingCustomer && (
                <CustomModal
                    title={`Sửa Khách hàng: ${editingCustomer.name}`}
                    onClose={() => setEditModal(false)}
                    actions={
                        <>
                            <button
                                type="button"
                                onClick={() => setEditModal(false)}
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                form="customer-edit-form"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                            >
                                Cập nhật
                            </button>
                        </>
                    }
                >
                    <form id="customer-edit-form" onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Khách hàng</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                            />
                        </div>
                    </form>
                </CustomModal>
            )}

            {/* Modal Xác nhận Xóa */}
            {deleteConfirmationModal && customerToDelete && (
                <CustomModal
                    title="Xác nhận Xóa Khách hàng"
                    onClose={() => setDeleteConfirmationModal(false)}
                    actions={
                        <>
                            <button
                                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setDeleteConfirmationModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                                onClick={() => deleteCustomer(customerToDelete)}
                            >
                                🗑️ Xóa Vĩnh Viễn
                            </button>
                        </>
                    }
                >
                    <p className="text-gray-700">Bạn có chắc chắn muốn xóa khách hàng **{customerToDelete.name}** ({customerToDelete.phone}) không?</p>
                    <p className="text-sm text-red-500 mt-2 font-medium">Lưu ý: Hành động này không thể hoàn tác.</p>
                </CustomModal>
            )}

            {/* Toast/Success Message  */}
            {successMessage && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
                    {successMessage}
                </div>
            )}
        </AuthenticatedLayout>
    );
}