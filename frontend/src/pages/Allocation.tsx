import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { allocationApi, courseApi, roomApi } from '@/services/api';
import { AllocationRequest, Course, Room } from '@/types';
import { CalendarIcon, ClockIcon, PlayIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AllocationFormData {
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  selectedCourses: number[];
}

interface PreviewResult {
  matakuliah_id: number;
  matakuliah_nama: string;
  jumlah_peserta: number;
  allocations: Array<{
    ruang_id: number;
    ruang_nama: string;
    kapasitas: number;
    jumlah_peserta_dialokasikan: number;
  }>;
  total_waste: number;
  success: boolean;
  message?: string;
}

export default function Allocation() {
  const [formData, setFormData] = useState<AllocationFormData>({
    tanggal: '',
    waktu_mulai: '',
    waktu_selesai: '',
    selectedCourses: []
  });
  const [previewResults, setPreviewResults] = useState<PreviewResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch active courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'active'],
    queryFn: async () => {
      const response = await courseApi.getActive();
      return response.data.data || [];
    }
  });

  // Fetch rooms
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await roomApi.getAll();
      return response.data.data || [];
    }
  });

  // Preview allocation mutation
  const previewMutation = useMutation({
    mutationFn: allocationApi.getPreview,
    onSuccess: (response) => {
      setPreviewResults(response.data.data?.preview || []);
      setShowPreview(true);
    }
  });

  // Auto allocate mutation
  const allocateMutation = useMutation({
    mutationFn: allocationApi.autoAllocate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] });
      setShowPreview(false);
      setFormData({
        tanggal: '',
        waktu_mulai: '',
        waktu_selesai: '',
        selectedCourses: []
      });
    }
  });

  const handlePreview = () => {
    if (!formData.tanggal || !formData.waktu_mulai || !formData.waktu_selesai) {
      alert('Mohon isi tanggal dan waktu terlebih dahulu');
      return;
    }

    const request: AllocationRequest = {
      tanggal: formData.tanggal,
      waktu_mulai: formData.waktu_mulai,
      waktu_selesai: formData.waktu_selesai,
      matakuliah_ids: formData.selectedCourses.length > 0 ? formData.selectedCourses : undefined
    };

    previewMutation.mutate(request);
  };

  const handleAllocate = () => {
    if (!formData.tanggal || !formData.waktu_mulai || !formData.waktu_selesai) {
      alert('Mohon isi tanggal dan waktu terlebih dahulu');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin melakukan alokasi otomatis?')) {
      return;
    }

    setIsAllocating(true);
    const request: AllocationRequest = {
      tanggal: formData.tanggal,
      waktu_mulai: formData.waktu_mulai,
      waktu_selesai: formData.waktu_selesai,
      matakuliah_ids: formData.selectedCourses.length > 0 ? formData.selectedCourses : undefined
    };

    allocateMutation.mutate(request, {
      onSettled: () => {
        setIsAllocating(false);
      }
    });
  };

  const handleCourseToggle = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }));
  };

  const getCourseById = (id: number) => courses.find(course => course.id === id);
  const getRoomById = (id: number) => rooms.find(room => room.id === id);

  if (coursesLoading || roomsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alokasi Ruang</h1>
          <p className="mt-1 text-sm text-gray-500">
            Alokasi otomatis ruang ujian untuk matakuliah
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alokasi Ruang</h1>
        <p className="mt-1 text-sm text-gray-500">
          Alokasi otomatis ruang ujian untuk matakuliah
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Pengaturan Alokasi</h3>
          </div>
          <div className="card-body space-y-4">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Ujian *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Mulai *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.waktu_mulai}
                    onChange={(e) => setFormData({ ...formData, waktu_mulai: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Selesai *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.waktu_selesai}
                    onChange={(e) => setFormData({ ...formData, waktu_selesai: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Matakuliah (Opsional - kosongkan untuk semua matakuliah aktif)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada matakuliah aktif</p>
                ) : (
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <label key={course.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.selectedCourses.includes(course.id!)}
                          onChange={() => handleCourseToggle(course.id!)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {course.kode_mk} - {course.nama_mk}
                          </div>
                          <div className="text-xs text-gray-500">
                            {course.jumlah_peserta} peserta
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handlePreview}
                disabled={previewMutation.isLoading}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleAllocate}
                disabled={allocateMutation.isLoading || isAllocating}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlayIcon className="h-4 w-4" />
                <span>
                  {allocateMutation.isLoading || isAllocating ? 'Mengalokasikan...' : 'Alokasi Otomatis'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Preview Alokasi</h3>
            </div>
            <div className="card-body">
              {previewResults.length === 0 ? (
                <p className="text-gray-500">Tidak ada hasil preview</p>
              ) : (
                <div className="space-y-4">
                  {previewResults.map((result) => {
                    const course = getCourseById(result.matakuliah_id);
                    return (
                      <div key={result.matakuliah_id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {course?.kode_mk} - {course?.nama_mk}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {result.jumlah_peserta} peserta
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {result.success ? (
                              <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <XMarkIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              result.success ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.success ? 'Berhasil' : 'Gagal'}
                            </span>
                          </div>
                        </div>

                        {result.success && result.allocations.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Alokasi Ruang:</p>
                            {result.allocations.map((allocation, index) => {
                              const room = getRoomById(allocation.ruang_id);
                              return (
                                <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                  <span>{room?.nama_ruang} ({room?.lokasi})</span>
                                  <span className="font-medium">
                                    {allocation.jumlah_peserta_dialokasikan} / {allocation.kapasitas}
                                  </span>
                                </div>
                              );
                            })}
                            <div className="text-xs text-gray-500 mt-2">
                              Total waste: {result.total_waste} kursi
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-red-600">{result.message}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-500">Total Matakuliah Aktif</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600">{rooms.length}</div>
            <div className="text-sm text-gray-500">Total Ruang Tersedia</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-purple-600">
              {courses.reduce((sum, course) => sum + course.jumlah_peserta, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Peserta</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-orange-600">
              {rooms.reduce((sum, room) => sum + room.kapasitas, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Kapasitas</div>
          </div>
        </div>
      </div>
    </div>
  );
} 