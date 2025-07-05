import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/services/api';
import type { Room } from '@/types';

export default function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch rooms data
  const { data: rooms = [], isLoading, error } = useQuery('rooms', getRooms);

  // Mutations
  const createMutation = useMutation(createRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
      toast.success('Ruang berhasil ditambahkan');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menambahkan ruang');
    },
  });

  const updateMutation = useMutation(updateRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
      toast.success('Ruang berhasil diperbarui');
      setIsModalOpen(false);
      setEditingRoom(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal memperbarui ruang');
    },
  });

  const deleteMutation = useMutation(deleteRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
      toast.success('Ruang berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal menghapus ruang');
    },
  });

  // Filter rooms based on search term
  const filteredRooms = rooms.filter((room: Room) =>
    room.nama_ruang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.lokasi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.gedung?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (formData: FormData) => {
    const roomData = {
      nama_ruang: formData.get('nama_ruang') as string,
      kapasitas: parseInt(formData.get('kapasitas') as string),
      lokasi: formData.get('lokasi') as string,
      lantai: parseInt(formData.get('lantai') as string) || undefined,
      gedung: formData.get('gedung') as string,
      status: formData.get('status') as 'aktif' | 'nonaktif' | 'maintenance',
    };

    if (editingRoom) {
      updateMutation.mutate({ id: editingRoom.id!, ...roomData });
    } else {
      createMutation.mutate(roomData);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ruang ini?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {(error as any).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ruang Ujian</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data ruang ujian dan kapasitasnya
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah Ruang
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari ruang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Rooms Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nama Ruang</th>
                  <th>Kapasitas</th>
                  <th>Lokasi</th>
                  <th>Gedung</th>
                  <th>Lantai</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room: Room) => (
                  <tr key={room.id}>
                    <td className="font-medium">{room.nama_ruang}</td>
                    <td>{room.kapasitas} orang</td>
                    <td>{room.lokasi || '-'}</td>
                    <td>{room.gedung || '-'}</td>
                    <td>{room.lantai || '-'}</td>
                    <td>
                      <span className={`badge ${room.status === 'aktif' ? 'badge-success' : room.status === 'maintenance' ? 'badge-warning' : 'badge-error'}`}>
                        {room.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="btn btn-sm btn-outline"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id!)}
                          className="btn btn-sm btn-error"
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingRoom ? 'Edit Ruang' : 'Tambah Ruang Baru'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="label">Nama Ruang</label>
                  <input
                    type="text"
                    name="nama_ruang"
                    defaultValue={editingRoom?.nama_ruang}
                    required
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Kapasitas</label>
                  <input
                    type="number"
                    name="kapasitas"
                    defaultValue={editingRoom?.kapasitas}
                    min="1"
                    required
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Lokasi</label>
                  <input
                    type="text"
                    name="lokasi"
                    defaultValue={editingRoom?.lokasi}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Gedung</label>
                  <input
                    type="text"
                    name="gedung"
                    defaultValue={editingRoom?.gedung}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Lantai</label>
                  <input
                    type="number"
                    name="lantai"
                    defaultValue={editingRoom?.lantai}
                    min="1"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    defaultValue={editingRoom?.status || 'aktif'}
                    className="input w-full"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {createMutation.isLoading || updateMutation.isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRoom(null);
                  }}
                  className="btn btn-outline flex-1"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 