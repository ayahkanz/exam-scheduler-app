import { useQuery } from 'react-query';
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { roomApi, courseApi, allocationApi } from '@/services/api';
import StatCard from '@/components/StatCard';
import RecentAllocations from '@/components/RecentAllocations';
import RoomUtilizationChart from '@/components/RoomUtilizationChart';

export default function Dashboard() {
  // Fetch dashboard data
  const { data: roomStats } = useQuery('roomStats', () => roomApi.getStatistics());
  const { data: courses } = useQuery('courses', () => courseApi.getActive());
  const { data: recentAllocations } = useQuery('recentAllocations', () =>
    allocationApi.getStatistics({
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    })
  );

  const stats = [
    {
      name: 'Total Ruang',
      value: roomStats?.data?.total_rooms || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      change: '+2.5%',
      changeType: 'increase',
    },
    {
      name: 'Matakuliah Aktif',
      value: courses?.data?.length || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      change: '+12.3%',
      changeType: 'increase',
    },
    {
      name: 'Total Peserta',
      value: courses?.data?.reduce((sum: number, course: any) => sum + course.jumlah_peserta, 0) || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+8.1%',
      changeType: 'increase',
    },
    {
      name: 'Alokasi Hari Ini',
      value: recentAllocations?.data?.summary?.total_allocations || 0,
      icon: CalendarIcon,
      color: 'bg-orange-500',
      change: '+5.2%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan dan statistik aplikasi alokasi ruang ujian mahasiswa
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Charts and recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Room utilization chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Utilisasi Ruang</h3>
            <p className="mt-1 text-sm text-gray-500">
              Persentase penggunaan ruang ujian
            </p>
          </div>
          <div className="card-body">
            <RoomUtilizationChart />
          </div>
        </div>

        {/* Recent allocations */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Alokasi Terbaru</h3>
            <p className="mt-1 text-sm text-gray-500">
              Alokasi ruang yang baru dibuat
            </p>
          </div>
          <div className="card-body">
            <RecentAllocations />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Aksi Cepat</h3>
          <p className="mt-1 text-sm text-gray-500">
            Akses cepat ke fitur-fitur utama
          </p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Tambah Ruang</p>
                <p className="text-sm text-gray-500">Buat ruang ujian baru</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AcademicCapIcon className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Tambah Matakuliah</p>
                <p className="text-sm text-gray-500">Input data matakuliah</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-8 w-8 text-orange-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Alokasi Otomatis</p>
                <p className="text-sm text-gray-500">Alokasi ruang otomatis</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Lihat Laporan</p>
                <p className="text-sm text-gray-500">Generate laporan</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Status Sistem</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Database: Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">API: Responsive</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Storage: 75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 