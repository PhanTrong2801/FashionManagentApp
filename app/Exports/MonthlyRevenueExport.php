<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MonthlyRevenueExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $month;
    protected $year;

    public function __construct($month, $year)
    {
        $this->month = $month;
        $this->year = $year;
    }

    public function collection()
    {
        return Order::with(['user', 'customer'])
            ->whereMonth('created_at', $this->month)
            ->whereYear('created_at', $this->year)
            ->where('status', 'completed') // Chỉ lấy đơn thành công
            ->get();
    }

    // Tiêu đề cột
    public function headings(): array
    {
        return [
            'ID Đơn',
            'Mã Hóa Đơn',
            'Ngày tạo',
            'Khách hàng',
            'Nhân viên bán',
            'Phương thức TT',
            'Tổng tiền (VNĐ)',
        ];
    }

    // Map dữ liệu vào từng cột
    public function map($order): array
    {
        return [
            $order->id,
            $order->invoice_code,
            $order->created_at->format('d/m/Y H:i'),
            $order->customer ? $order->customer->name : 'Khách lẻ',
            $order->user ? $order->user->name : '---',
            $order->payment_method === 'bank' ? 'Chuyển khoản' : 'Tiền mặt',
            $order->total_amount,
        ];
    }

    // Style cho đẹp (In đậm dòng đầu)
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}