import { RuangModel, RuangWithAllocation } from '../models/Ruang';
import { MatakuliahModel, Matakuliah } from '../models/Matakuliah';
import pool from '../config/database';

export interface AllocationResult {
  matakuliah_id: number;
  matakuliah_nama: string;
  jumlah_peserta: number;
  allocations: RoomAllocation[];
  total_waste: number;
  success: boolean;
  message?: string;
}

export interface RoomAllocation {
  ruang_id: number;
  ruang_nama: string;
  kapasitas: number;
  jumlah_peserta_dialokasikan: number;
  waste: number;
  lokasi: string;
  lantai: number;
  gedung: string;
}

export interface AllocationRequest {
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  matakuliah_ids?: number[]; // If not provided, will allocate all active courses
}

export interface AllocationSummary {
  total_courses: number;
  success_count: number;
  failure_count: number;
  total_allocations: number;
  total_participants: number;
  total_waste: number;
  room_utilization: { ruang_nama: string; utilization_percentage: number }[];
}

export class RoomAllocationService {
  /**
   * Main allocation algorithm
   * Implements the optimal room allocation strategy
   */
  static async allocateRooms(request: AllocationRequest, courses?: Matakuliah[]): Promise<AllocationSummary> {
    const connection = await pool.getConnection();
    
    try {
      await connection.execute('START TRANSACTION');
      
      // Get courses that need allocation
      let coursesToAllocate: Matakuliah[];
      if (courses) {
        coursesToAllocate = courses;
      } else if (request.matakuliah_ids && request.matakuliah_ids.length > 0) {
        coursesToAllocate = await MatakuliahModel.findActive();
        coursesToAllocate = coursesToAllocate.filter(course => request.matakuliah_ids!.includes(course.id!));
      } else {
        coursesToAllocate = await MatakuliahModel.findNeedingAllocation();
      }
      
      // Sort courses by number of participants (descending) for optimal allocation
      coursesToAllocate.sort((a, b) => b.jumlah_peserta - a.jumlah_peserta);
      
      // Get available rooms for the specified time slot
      const availableRooms = await RuangModel.findWithAllocationInfo(
        request.tanggal,
        request.waktu_mulai,
        request.waktu_selesai
      );
      
      const results: AllocationResult[] = [];
      
      for (const course of coursesToAllocate) {
        const result = await this.allocateCourseToRooms(
          course,
          availableRooms,
          request,
          connection
        );
        results.push(result);
        
        // Update available rooms after each allocation
        if (result.success) {
          for (const allocation of result.allocations) {
            const room = availableRooms.find(r => r.id === allocation.ruang_id);
            if (room) {
              room.total_alokasi = (room.total_alokasi || 0) + allocation.jumlah_peserta_dialokasikan;
              room.available_capacity = (room.available_capacity || room.kapasitas) - allocation.jumlah_peserta_dialokasikan;
            }
          }
        }
      }
      
      await connection.execute('COMMIT');
      
      // Calculate summary
      const successCount = results.filter(r => r.success).length;
      const totalAllocations = results.reduce((sum, r) => sum + r.allocations.length, 0);
      const totalParticipants = results.reduce((sum, r) => sum + r.allocations.reduce((s, a) => s + a.jumlah_peserta_dialokasikan, 0), 0);
      const totalWaste = results.reduce((sum, r) => sum + r.total_waste, 0);
      
      // Get room utilization
      const roomUtilization = await this.getRoomUtilization(request.tanggal);
      
      return {
        total_courses: results.length,
        success_count: successCount,
        failure_count: results.length - successCount,
        total_allocations: totalAllocations,
        total_participants: totalParticipants,
        total_waste: totalWaste,
        room_utilization: roomUtilization
      };
      
    } catch (error) {
      await connection.execute('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }
  
  /**
   * Allocate a single course to optimal rooms
   */
  private static async allocateCourseToRooms(
    course: Matakuliah,
    availableRooms: RuangWithAllocation[],
    request: AllocationRequest,
    connection: any
  ): Promise<AllocationResult> {
    const result: AllocationResult = {
      matakuliah_id: course.id!,
      matakuliah_nama: course.nama_mk,
      jumlah_peserta: course.jumlah_peserta,
      allocations: [],
      total_waste: 0,
      success: false
    };
    
    try {
      // Filter rooms with available capacity
      const roomsWithCapacity = availableRooms.filter(room => 
        (room.available_capacity || room.kapasitas) > 0
      );
      
      if (roomsWithCapacity.length === 0) {
        result.message = 'Tidak ada ruang yang tersedia untuk slot waktu ini';
        return result;
      }
      
      // Find optimal room combination
      const optimalAllocation = this.findOptimalRoomCombination(
        course.jumlah_peserta,
        roomsWithCapacity
      );
      
      if (!optimalAllocation) {
        result.message = 'Tidak dapat menemukan kombinasi ruang yang optimal';
        return result;
      }
      
      // Create allocation records
      let nomorUrut = 1;
      for (const allocation of optimalAllocation) {
        const insertQuery = `
          INSERT INTO alokasi (
            matakuliah_id, ruang_id, tanggal, waktu_mulai, waktu_selesai,
            nomor_urut, jumlah_peserta_dialokasikan, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
          course.id,
          allocation.ruang_id,
          request.tanggal,
          request.waktu_mulai,
          request.waktu_selesai,
          nomorUrut,
          allocation.jumlah_peserta_dialokasikan,
          'direncanakan'
        ];
        
        await connection.execute(insertQuery, values);
        nomorUrut++;
      }
      
      result.allocations = optimalAllocation;
      result.total_waste = optimalAllocation.reduce((sum, alloc) => sum + alloc.waste, 0);
      result.success = true;
      result.message = 'Alokasi berhasil dibuat';
      
    } catch (error) {
      result.message = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
    
    return result;
  }
  
  /**
   * Find optimal room combination using dynamic programming approach
   * Prioritizes rooms in the same building/floor to minimize waste
   */
  private static findOptimalRoomCombination(
    targetParticipants: number,
    availableRooms: RuangWithAllocation[]
  ): RoomAllocation[] | null {
    // Group rooms by building and floor for proximity optimization
    const roomGroups = this.groupRoomsByLocation(availableRooms);
    
    // Try to find allocation within same building/floor first
    for (const group of roomGroups) {
      const allocation = this.findOptimalCombinationInGroup(targetParticipants, group);
      if (allocation) {
        return allocation;
      }
    }
    
    // If no optimal allocation found in same location, try all rooms
    return this.findOptimalCombinationInGroup(targetParticipants, availableRooms);
  }
  
  /**
   * Group rooms by building and floor
   */
  private static groupRoomsByLocation(rooms: RuangWithAllocation[]): RuangWithAllocation[][] {
    const groups: { [key: string]: RuangWithAllocation[] } = {};
    
    for (const room of rooms) {
      const key = `${room.gedung || 'unknown'}-${room.lantai || 0}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(room);
    }
    
    return Object.values(groups);
  }
  
  /**
   * Find optimal combination within a group of rooms
   */
  private static findOptimalCombinationInGroup(
    targetParticipants: number,
    rooms: RuangWithAllocation[]
  ): RoomAllocation[] | null {
    // Sort rooms by capacity (ascending) for better optimization
    const sortedRooms = [...rooms].sort((a, b) => 
      (a.available_capacity || a.kapasitas) - (b.available_capacity || b.kapasitas)
    );
    
    // Simple greedy approach: fill rooms in order
    const allocations: RoomAllocation[] = [];
    let remainingParticipants = targetParticipants;
    
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
    
    return remainingParticipants <= 0 ? allocations : null;
  }
  
  /**
   * Get allocation summary for a specific date
   */
  static async getAllocationSummary(tanggal: string): Promise<{
    total_courses: number;
    total_allocations: number;
    total_participants: number;
    total_waste: number;
    room_utilization: { ruang_nama: string; utilization_percentage: number }[];
  }> {
    const summaryQuery = `
      SELECT 
        COUNT(DISTINCT a.matakuliah_id) as total_courses,
        COUNT(a.id) as total_allocations,
        SUM(a.jumlah_peserta_dialokasikan) as total_participants,
        SUM(r.kapasitas - a.jumlah_peserta_dialokasikan) as total_waste
      FROM alokasi a
      JOIN ruang r ON a.ruang_id = r.id
      WHERE DATE(a.tanggal) = ? AND a.status != 'dibatalkan'
    `;
    
    const utilizationQuery = `
      SELECT 
        r.nama_ruang,
        ROUND(AVG(a.jumlah_peserta_dialokasikan / r.kapasitas * 100), 2) as utilization_percentage
      FROM alokasi a
      JOIN ruang r ON a.ruang_id = r.id
      WHERE DATE(a.tanggal) = ? AND a.status != 'dibatalkan'
      GROUP BY r.id, r.nama_ruang
      ORDER BY utilization_percentage DESC
    `;
    
    const [summaryResult, utilizationResult] = await Promise.all([
      pool.execute(summaryQuery, [tanggal]),
      pool.execute(utilizationQuery, [tanggal])
    ]);
    
    const summaryRows = summaryResult[0] as any[];
    const utilizationRows = utilizationResult[0] as any[];
    
    return {
      ...summaryRows[0],
      room_utilization: utilizationRows
    };
  }
  
  /**
   * Get room utilization for a specific date
   */
  private static async getRoomUtilization(tanggal: string): Promise<{ ruang_nama: string; utilization_percentage: number }[]> {
    const query = `
      SELECT 
        r.nama_ruang,
        ROUND(AVG(a.jumlah_peserta_dialokasikan / r.kapasitas * 100), 2) as utilization_percentage
      FROM alokasi a
      JOIN ruang r ON a.ruang_id = r.id
      WHERE DATE(a.tanggal) = ? AND a.status != 'dibatalkan'
      GROUP BY r.id, r.nama_ruang
      ORDER BY utilization_percentage DESC
    `;
    
    const [rows] = await pool.execute(query, [tanggal]);
    return rows as { ruang_nama: string; utilization_percentage: number }[];
  }
  
  /**
   * Check for allocation conflicts
   */
  static async checkConflicts(request: AllocationRequest): Promise<{
    has_conflicts: boolean;
    conflicts: Array<{
      ruang_nama: string;
      existing_matakuliah: string;
      conflicting_matakuliah: string;
    }>;
  }> {
    const query = `
      SELECT 
        r.nama_ruang,
        m1.nama_mk as existing_matakuliah,
        m2.nama_mk as conflicting_matakuliah
      FROM alokasi a1
      JOIN ruang r ON a1.ruang_id = r.id
      JOIN matakuliah m1 ON a1.matakuliah_id = m1.id
      JOIN matakuliah m2 ON m2.id IN (?)
      WHERE a1.tanggal = ? 
        AND a1.waktu_mulai = ? 
        AND a1.waktu_selesai = ?
        AND a1.status != 'dibatalkan'
        AND m2.id != a1.matakuliah_id
    `;
    
    const [rows] = await pool.execute(query, [
      request.matakuliah_ids || [],
      request.tanggal,
      request.waktu_mulai,
      request.waktu_selesai
    ]);
    
    const result = rows as any[];
    
    return {
      has_conflicts: result.length > 0,
      conflicts: result
    };
  }
} 