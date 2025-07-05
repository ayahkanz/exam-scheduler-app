import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { roomApi, courseApi, allocationApi } from '@/services/api';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportFilters {
  startDate: string;
  endDate: string;
  reportType: 'allocation' | 'room' | 'course' | 'summary';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    endDate: new Date().toISOString().split('T')[0],
    reportType: 'summary'
  });

  // Fetch statistics data
  const { data: roomStats } = useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      const response = await roomApi.getStatistics();
      return response.data.data;
    }
  });

  const { data: courseStats } = useQuery({
    queryKey: ['course-stats'],
    queryFn: async () => {
      const response = await courseApi.getStatistics();
      return response.data.data;
    }
  });

  const { data: allocationStats } = useQuery({
    queryKey: ['allocation-stats', filters.startDate, filters.endDate],
    queryFn: async () => {
      const response = await allocationApi.getStatistics({
        start_date: filters.startDate,
        end_date: filters.endDate
      });
      return response.data.data;
    }
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomApi.getAll();
      return response.data.data || [];
    }
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return response.data.data || [];
    }
  });

  const handleExport = (type: string) => {
    // Placeholder for export functionality
    alert(`Export ${type} report akan segera tersedia`);
  };

  const getRoomUtilizationData = () => {
    return rooms.map(room => ({
      name: room.nama_ruang,
      kapasitas: room.kapasitas,
      terpakai: Math.floor(Math.random() * room.kapasitas), // Placeholder data
      tersedia: room.kapasitas - Math.floor(Math.random() * room.kapasitas)
    }));
  };

  const getCourseDistributionData = () => {
    const statusCounts = courses.reduce((acc, course) => {
      const status = course.status || 'aktif';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };

  const getParticipantRangeData = () => {
    const ranges = [
      { min: 0, max: 50, label: '0-50' },
      { min: 51, max: 100, label: '51-100' },
      { min: 101, max: 200, label: '101-200' },
      { min: 201, max: 500, label: '201-500' },
      { min: 501, max: Infinity, label: '500+' }
    ];

    return ranges.map(range => ({
      range: range.label,
      count: courses.filter(course => 
        course.jumlah_peserta >= range.min && course.jumlah_peserta <= range.max
      ).length
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate laporan dan statistik alokasi ruang
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('pdf')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Filter Laporan</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Laporan
              </label>
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary">Ringkasan</option>
                <option value="allocation">Alokasi</option>
                <option value="room">Ruang</option>
                <option value="course">Matakuliah</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Ruang</p>
                <p className="text-2xl font-bold text-gray-900">{roomStats?.total_rooms || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Matakuliah</p>
                <p className="text-2xl font-bold text-gray-900">{courseStats?.total_courses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Peserta</p>
                <p className="text-2xl font-bold text-gray-900">{courseStats?.total_participants || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alokasi Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">{allocationStats?.today_allocations || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Utilization Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Utilisasi Ruang</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRoomUtilizationData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="terpakai" fill="#8884d8" name="Terpakai" />
                <Bar dataKey="tersedia" fill="#82ca9d" name="Tersedia" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Distribusi Status Matakuliah</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCourseDistributionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCourseDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participant Range Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Distribusi Jumlah Peserta</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getParticipantRangeData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" name="Jumlah Matakuliah" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Allocations */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Alokasi Terbaru</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {allocationStats?.recent_allocations?.slice(0, 5).map((allocation: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{allocation.matakuliah_nama}</p>
                    <p className="text-sm text-gray-500">{allocation.ruang_nama}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{allocation.tanggal}</p>
                    <p className="text-xs text-gray-500">{allocation.waktu_mulai} - {allocation.waktu_selesai}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">Tidak ada data alokasi terbaru</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rooms by Utilization */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Ruang Terpopuler</h3>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kapasitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisasi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.slice(0, 5).map((room) => (
                    <tr key={room.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room.nama_ruang}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.kapasitas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span>{Math.floor(Math.random() * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Statistik Matakuliah</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Matakuliah Aktif</span>
                <span className="font-medium">{courseStats?.active_courses || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rata-rata Peserta</span>
                <span className="font-medium">
                  {courseStats?.total_participants && courseStats?.total_courses 
                    ? Math.round(courseStats.total_participants / courseStats.total_courses)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Matakuliah Terbesar</span>
                <span className="font-medium">
                  {courses.length > 0 
                    ? Math.max(...courses.map(c => c.jumlah_peserta))
                    : 0} peserta
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Matakuliah Terkecil</span>
                <span className="font-medium">
                  {courses.length > 0 
                    ? Math.min(...courses.map(c => c.jumlah_peserta))
                    : 0} peserta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 