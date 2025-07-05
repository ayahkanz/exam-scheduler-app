import { Request, Response } from 'express';
import { RoomAllocationService, AllocationRequest } from '../services/RoomAllocationService';
import Joi from 'joi';

// Validation schemas
const allocationRequestSchema = Joi.object({
  tanggal: Joi.date().required(),
  waktu_mulai: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  waktu_selesai: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  matakuliah_ids: Joi.array().items(Joi.number()).optional()
});

export class AllocationController {
  // Auto allocate rooms for courses
  static async autoAllocate(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = allocationRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          error: error.details[0].message
        });
        return;
      }

      const request: AllocationRequest = {
        tanggal: value.tanggal,
        waktu_mulai: value.waktu_mulai,
        waktu_selesai: value.waktu_selesai,
        matakuliah_ids: value.matakuliah_ids
      };

      // Get courses that need allocation
      const { MatakuliahModel } = await import('../models/Matakuliah');
      let courses;
      if (request.matakuliah_ids && request.matakuliah_ids.length > 0) {
        courses = await MatakuliahModel.findActive();
        courses = courses.filter(course => request.matakuliah_ids!.includes(course.id!));
      } else {
        courses = await MatakuliahModel.findNeedingAllocation();
      }

      if (courses.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Tidak ada matakuliah yang memerlukan alokasi ruang'
        });
        return;
      }

      // Perform room allocation
      const result = await RoomAllocationService.allocateRooms(request, courses);

      res.json({
        success: true,
        data: result,
        message: `Berhasil mengalokasikan ${result.success_count} dari ${result.total_courses} matakuliah`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal melakukan alokasi otomatis',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get allocation summary
  static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { tanggal } = req.query;

      if (!tanggal) {
        res.status(400).json({
          success: false,
          message: 'Parameter tanggal harus disediakan'
        });
        return;
      }

      const summary = await RoomAllocationService.getAllocationSummary(tanggal as string);

      res.json({
        success: true,
        data: summary,
        message: 'Berhasil mengambil ringkasan alokasi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil ringkasan alokasi',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Check for allocation conflicts
  static async checkConflicts(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = allocationRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          error: error.details[0].message
        });
        return;
      }

      const request: AllocationRequest = {
        tanggal: value.tanggal,
        waktu_mulai: value.waktu_mulai,
        waktu_selesai: value.waktu_selesai,
        matakuliah_ids: value.matakuliah_ids
      };

      const conflicts = await RoomAllocationService.checkConflicts(request);
      
      res.json({
        success: true,
        data: conflicts,
        message: conflicts.has_conflicts ? 'Terdapat konflik alokasi' : 'Tidak ada konflik alokasi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal memeriksa konflik alokasi',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get allocation preview (without saving to database)
  static async getPreview(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = allocationRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          error: error.details[0].message
        });
        return;
      }

      const request: AllocationRequest = {
        tanggal: value.tanggal,
        waktu_mulai: value.waktu_mulai,
        waktu_selesai: value.waktu_selesai,
        matakuliah_ids: value.matakuliah_ids
      };

      // Get courses that need allocation
      const { MatakuliahModel } = await import('../models/Matakuliah');
      let courses;
      if (request.matakuliah_ids && request.matakuliah_ids.length > 0) {
        courses = await MatakuliahModel.findActive();
        courses = courses.filter(course => request.matakuliah_ids!.includes(course.id!));
      } else {
        courses = await MatakuliahModel.findNeedingAllocation();
      }

      // Get available rooms
      const { RuangModel } = await import('../models/Ruang');
      const availableRooms = await RuangModel.findWithAllocationInfo(
        request.tanggal,
        request.waktu_mulai,
        request.waktu_selesai
      );

      // Generate preview without saving
      const preview = courses.map(course => {
        const roomsWithCapacity = availableRooms.filter(room => 
          (room.available_capacity || room.kapasitas) > 0
        );

        if (roomsWithCapacity.length === 0) {
          return {
            matakuliah_id: course.id,
            matakuliah_nama: course.nama_mk,
            jumlah_peserta: course.jumlah_peserta,
            allocations: [],
            total_waste: 0,
            success: false,
            message: 'Tidak ada ruang yang tersedia'
          };
        }

        // Simple preview allocation (not optimal, just for preview)
        const allocations = [];
        let remainingParticipants = course.jumlah_peserta;
        const sortedRooms = [...roomsWithCapacity].sort((a, b) => 
          (a.available_capacity || a.kapasitas) - (b.available_capacity || b.kapasitas)
        );

        for (const room of sortedRooms) {
          if (remainingParticipants <= 0) break;
          
          const availableCapacity = room.available_capacity || room.kapasitas;
          if (availableCapacity <= 0) continue;

          const participantsToAllocate = Math.min(remainingParticipants, availableCapacity);
          
          allocations.push({
            ruang_id: room.id!,
            ruang_nama: room.nama_ruang,
            kapasitas: room.kapasitas,
            jumlah_peserta_dialokasikan: participantsToAllocate,
            waste: availableCapacity - participantsToAllocate,
            lokasi: room.lokasi || '',
            lantai: room.lantai || 0,
            gedung: room.gedung || ''
          });

          remainingParticipants -= participantsToAllocate;
        }

        return {
          matakuliah_id: course.id,
          matakuliah_nama: course.nama_mk,
          jumlah_peserta: course.jumlah_peserta,
          allocations,
          total_waste: allocations.reduce((sum, alloc) => sum + alloc.waste, 0),
          success: remainingParticipants <= 0,
          message: remainingParticipants <= 0 ? 'Alokasi memungkinkan' : 'Tidak cukup ruang'
        };
      });

      const successCount = preview.filter(p => p.success).length;
      const totalWaste = preview.reduce((sum, p) => sum + p.total_waste, 0);

      res.json({
        success: true,
        data: {
          preview,
          summary: {
            total_courses: preview.length,
            success_count: successCount,
            failure_count: preview.length - successCount,
            total_waste: totalWaste
          }
        },
        message: `Preview alokasi: ${successCount} dari ${preview.length} matakuliah dapat dialokasikan`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal membuat preview alokasi',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get allocation statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        res.status(400).json({
          success: false,
          message: 'Parameter start_date dan end_date harus disediakan'
        });
        return;
      }

      // Get allocation statistics for date range
      const query = `
        SELECT 
          DATE(a.tanggal) as tanggal,
          COUNT(DISTINCT a.matakuliah_id) as total_courses,
          COUNT(a.id) as total_allocations,
          SUM(a.jumlah_peserta_dialokasikan) as total_participants,
          SUM(r.kapasitas - a.jumlah_peserta_dialokasikan) as total_waste,
          ROUND(AVG(a.jumlah_peserta_dialokasikan / r.kapasitas * 100), 2) as avg_utilization
        FROM alokasi a
        JOIN ruang r ON a.ruang_id = r.id
        WHERE a.tanggal BETWEEN ? AND ?
          AND a.status != 'dibatalkan'
        GROUP BY DATE(a.tanggal)
        ORDER BY tanggal
      `;

      const { default: pool } = await import('../config/database');
      const [rows] = await pool.execute(query, [start_date, end_date]);
      const result = rows as any[];

      res.json({
        success: true,
        data: {
          daily_stats: result,
          summary: {
            total_days: result.length,
            total_courses: result.reduce((sum: number, row: any) => sum + parseInt(row.total_courses), 0),
            total_allocations: result.reduce((sum: number, row: any) => sum + parseInt(row.total_allocations), 0),
            total_participants: result.reduce((sum: number, row: any) => sum + parseInt(row.total_participants), 0),
            total_waste: result.reduce((sum: number, row: any) => sum + parseInt(row.total_waste), 0),
            avg_utilization: result.length > 0 
              ? result.reduce((sum: number, row: any) => sum + parseFloat(row.avg_utilization), 0) / result.length
              : 0
          }
        },
        message: 'Berhasil mengambil statistik alokasi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil statistik alokasi',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 