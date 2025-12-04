<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PayrollExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $month;
    protected $year;

    public function __construct($month, $year)
    {
        $this->month =$month;
        $this->year =$year;
    }

    public function collection()
    {
        return User::where('role', 'user')
            ->with(['work_sessions' => function($q){
                $q->whereMonth('check_in', $this->month)
                ->whereYear('check_in', $this->year)
                ->whereNotNull('check_out');
            }])
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Tên Nhân Viên',
            'Tháng',
            'Tổng Giờ Làm',
            'Lương Cơ Bản (VNĐ/h)',
            'Tổng Lương (VNĐ)',
        ];
    }

    public function map($user): array
    {
        $totalMinutes = $user->work_sessions->sum('duration_minutes');
        $totalSalary  = $user->work_sessions->sum('salary_earned');

        return [
            $user->id,
            $user->name,
            $this->month . '/' . $this->year,
            round($totalMinutes / 60, 2),
            $user->hourly_rate,
            $totalSalary,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}
