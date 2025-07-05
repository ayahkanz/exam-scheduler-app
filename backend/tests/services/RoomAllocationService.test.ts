import { RoomAllocationService, AllocationRequest } from '../../src/services/RoomAllocationService';
import { RuangModel } from '../../src/models/Ruang';
import { MatakuliahModel } from '../../src/models/Matakuliah';

// Mock the database models
jest.mock('../../src/models/Ruang');
jest.mock('../../src/models/Matakuliah');
jest.mock('../../src/config/database');

describe('RoomAllocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('allocateRooms', () => {
    it('should allocate rooms successfully for courses', async () => {
      // Mock data
      const mockCourses = [
        {
          id: 1,
          kode_mk: 'MTK101',
          nama_mk: 'Matematika Dasar',
          jumlah_peserta: 75,
          dosen: 'Dr. Ahmad',
          status: 'aktif'
        },
        {
          id: 2,
          kode_mk: 'FIS101',
          nama_mk: 'Fisika Dasar',
          jumlah_peserta: 45,
          dosen: 'Dr. Budi',
          status: 'aktif'
        }
      ];

      const mockRooms = [
        {
          id: 1,
          nama_ruang: 'A101',
          kapasitas: 55,
          lokasi: 'Gedung A',
          lantai: 1,
          gedung: 'Gedung A',
          status: 'aktif',
          total_alokasi: 0,
          available_capacity: 55
        },
        {
          id: 2,
          nama_ruang: 'A102',
          kapasitas: 55,
          lokasi: 'Gedung A',
          lantai: 1,
          gedung: 'Gedung A',
          status: 'aktif',
          total_alokasi: 0,
          available_capacity: 55
        },
        {
          id: 3,
          nama_ruang: 'A103',
          kapasitas: 30,
          lokasi: 'Gedung A',
          lantai: 1,
          gedung: 'Gedung A',
          status: 'aktif',
          total_alokasi: 0,
          available_capacity: 30
        }
      ];

      // Mock the model methods
      (MatakuliahModel.findNeedingAllocation as jest.Mock).mockResolvedValue(mockCourses);
      (RuangModel.findWithAllocationInfo as jest.Mock).mockResolvedValue(mockRooms);

      // Mock database client
      const mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
        release: jest.fn()
      };

      const mockPool = {
        connect: jest.fn().mockResolvedValue(mockClient)
      };

      // Mock the database pool
      jest.doMock('../../src/config/database', () => ({
        default: mockPool
      }));

      const request: AllocationRequest = {
        tanggal: '2024-01-15',
        waktu_mulai: '08:00',
        waktu_selesai: '10:00'
      };

      const results = await RoomAllocationService.allocateRooms(request);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].matakuliah_nama).toBe('Matematika Dasar');
      expect(results[0].allocations).toHaveLength(2); // Should use 2 rooms for 75 participants
      expect(results[1].success).toBe(true);
      expect(results[1].matakuliah_nama).toBe('Fisika Dasar');
      expect(results[1].allocations).toHaveLength(1); // Should use 1 room for 45 participants
    });

    it('should handle insufficient room capacity', async () => {
      const mockCourses = [
        {
          id: 1,
          kode_mk: 'MTK101',
          nama_mk: 'Matematika Dasar',
          jumlah_peserta: 200,
          dosen: 'Dr. Ahmad',
          status: 'aktif'
        }
      ];

      const mockRooms = [
        {
          id: 1,
          nama_ruang: 'A101',
          kapasitas: 55,
          lokasi: 'Gedung A',
          lantai: 1,
          gedung: 'Gedung A',
          status: 'aktif',
          total_alokasi: 0,
          available_capacity: 55
        }
      ];

      (MatakuliahModel.findNeedingAllocation as jest.Mock).mockResolvedValue(mockCourses);
      (RuangModel.findWithAllocationInfo as jest.Mock).mockResolvedValue(mockRooms);

      const mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
        release: jest.fn()
      };

      const mockPool = {
        connect: jest.fn().mockResolvedValue(mockClient)
      };

      jest.doMock('../../src/config/database', () => ({
        default: mockPool
      }));

      const request: AllocationRequest = {
        tanggal: '2024-01-15',
        waktu_mulai: '08:00',
        waktu_selesai: '10:00'
      };

      const results = await RoomAllocationService.allocateRooms(request);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].message).toContain('Tidak dapat menemukan kombinasi ruang yang optimal');
    });
  });

  describe('checkConflicts', () => {
    it('should detect allocation conflicts', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [
            {
              ruang_nama: 'A101',
              existing_matakuliah: 'Matematika Dasar',
              conflicting_matakuliah: 'Fisika Dasar'
            }
          ]
        })
      };

      jest.doMock('../../src/config/database', () => ({
        default: mockPool
      }));

      const request: AllocationRequest = {
        tanggal: '2024-01-15',
        waktu_mulai: '08:00',
        waktu_selesai: '10:00'
      };

      const conflicts = await RoomAllocationService.checkConflicts(request);

      expect(conflicts.has_conflicts).toBe(true);
      expect(conflicts.conflicts).toHaveLength(1);
      expect(conflicts.conflicts[0].ruang_nama).toBe('A101');
    });

    it('should return no conflicts when none exist', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: []
        })
      };

      jest.doMock('../../src/config/database', () => ({
        default: mockPool
      }));

      const request: AllocationRequest = {
        tanggal: '2024-01-15',
        waktu_mulai: '08:00',
        waktu_selesai: '10:00'
      };

      const conflicts = await RoomAllocationService.checkConflicts(request);

      expect(conflicts.has_conflicts).toBe(false);
      expect(conflicts.conflicts).toHaveLength(0);
    });
  });

  describe('getAllocationSummary', () => {
    it('should return allocation summary', async () => {
      const mockPool = {
        query: jest.fn()
          .mockResolvedValueOnce({
            rows: [{
              total_courses: 5,
              total_allocations: 8,
              total_participants: 250,
              total_waste: 45
            }]
          })
          .mockResolvedValueOnce({
            rows: [
              { ruang_nama: 'A101', utilization_percentage: 85.5 },
              { ruang_nama: 'A102', utilization_percentage: 72.3 }
            ]
          })
      };

      jest.doMock('../../src/config/database', () => ({
        default: mockPool
      }));

      const request: AllocationRequest = {
        tanggal: '2024-01-15',
        waktu_mulai: '08:00',
        waktu_selesai: '10:00'
      };

      const summary = await RoomAllocationService.getAllocationSummary(request);

      expect(summary.total_courses).toBe(5);
      expect(summary.total_allocations).toBe(8);
      expect(summary.total_participants).toBe(250);
      expect(summary.total_waste).toBe(45);
      expect(summary.room_utilization).toHaveLength(2);
    });
  });
}); 