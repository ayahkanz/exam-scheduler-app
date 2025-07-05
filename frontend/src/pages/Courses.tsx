import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { courseApi } from '@/services/api';
import { Course, CourseFormData } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course;
  mode: 'create' | 'edit';
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course, mode }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CourseFormData>({
    kode_mk: course?.kode_mk || '',
    nama_mk: course?.nama_mk || '',
    jumlah_peserta: course?.jumlah_peserta || 0,
    dosen: course?.dosen || '',
    semester: course?.semester || '',
    tahun_ajaran: course?.tahun_ajaran || '',
    status: course?.status || 'aktif'
  });

  const createMutation = useMutation({
    mutationFn: courseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CourseFormData> }) => 
      courseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      createMutation.mutate(formData);
    } else if (course) {
      updateMutation.mutate({ id: course.id!, data: formData });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Tambah Matakuliah' : 'Edit Matakuliah'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Matakuliah *
            </label>
            <input
              type="text"
              value={formData.kode_mk}
              onChange={(e) => setFormData({ ...formData, kode_mk: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Matakuliah *
            </label>
            <input
              type="text"
              value={formData.nama_mk}
              onChange={(e) => setFormData({ ...formData, nama_mk: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Peserta *
            </label>
            <input
              type="number"
              value={formData.jumlah_peserta}
              onChange={(e) => setFormData({ ...formData, jumlah_peserta: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosen
            </label>
            <input
              type="text"
              value={formData.dosen}
              onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Semester</option>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
              <option value="Pendek">Pendek</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Ajaran
            </label>
            <input
              type="text"
              value={formData.tahun_ajaran}
              onChange={(e) => setFormData({ ...formData, tahun_ajaran: e.target.value })}
              placeholder="2023/2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isLoading || updateMutation.isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return response.data.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: courseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  const handleCreate = () => {
    setSelectedCourse(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus matakuliah "${course.nama_mk}"?`)) {
      deleteMutation.mutate(course.id!);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aktif: { color: 'bg-green-100 text-green-800', label: 'Aktif' },
      selesai: { color: 'bg-gray-100 text-gray-800', label: 'Selesai' },
      dibatalkan: { color: 'bg-red-100 text-red-800', label: 'Dibatalkan' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aktif;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matakuliah</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data matakuliah dan jumlah peserta
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matakuliah</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data matakuliah dan jumlah peserta
          </p>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-center text-red-600">
              <p>Terjadi kesalahan saat memuat data matakuliah</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matakuliah</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data matakuliah dan jumlah peserta
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Matakuliah</span>
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada data matakuliah</p>
              <button
                onClick={handleCreate}
                className="btn btn-primary"
              >
                Tambah Matakuliah Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Matakuliah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peserta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.kode_mk}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.nama_mk}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.jumlah_peserta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.dosen || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.semester ? `${course.semester} ${course.tahun_ajaran}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(course.status || 'aktif')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                            disabled={deleteMutation.isLoading}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        mode={modalMode}
      />
    </div>
  );
} 