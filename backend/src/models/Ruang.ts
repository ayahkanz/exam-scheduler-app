import pool from '../config/database';

export interface Ruang {
  id?: number;
  nama_ruang: string;
  kapasitas: number;
  lokasi?: string;
  lantai?: number;
  gedung?: string;
  status?: 'aktif' | 'nonaktif' | 'maintenance';
  created_at?: Date;
  updated_at?: Date;
}

export interface RuangWithAllocation extends Ruang {
  total_alokasi?: number;
  available_capacity?: number;
}

export class RuangModel {
  // Get all rooms
  static async findAll(): Promise<Ruang[]> {
    const query = 'SELECT * FROM ruang ORDER BY nama_ruang';
    const [rows] = await pool.execute(query);
    return rows as Ruang[];
  }

  // Get room by ID
  static async findById(id: number): Promise<Ruang | null> {
    const query = 'SELECT * FROM ruang WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    const result = rows as Ruang[];
    return result[0] || null;
  }

  // Get room by name
  static async findByNama(nama_ruang: string): Promise<Ruang | null> {
    const query = 'SELECT * FROM ruang WHERE nama_ruang = ?';
    const [rows] = await pool.execute(query, [nama_ruang]);
    const result = rows as Ruang[];
    return result[0] || null;
  }

  // Get available rooms by capacity
  static async findAvailableByCapacity(minCapacity: number, maxCapacity?: number): Promise<Ruang[]> {
    let query = 'SELECT * FROM ruang WHERE status = ? AND kapasitas >= ?';
    const params: any[] = ['aktif', minCapacity];
    
    if (maxCapacity) {
      query += ' AND kapasitas <= ?';
      params.push(maxCapacity);
    }
    
    query += ' ORDER BY kapasitas ASC, nama_ruang';
    const [rows] = await pool.execute(query, params);
    return rows as Ruang[];
  }

  // Get rooms by building and floor
  static async findByLocation(gedung?: string, lantai?: number): Promise<Ruang[]> {
    let query = 'SELECT * FROM ruang WHERE status = ?';
    const params: any[] = ['aktif'];
    
    if (gedung) {
      query += ' AND gedung = ?';
      params.push(gedung);
    }
    
    if (lantai !== undefined) {
      query += ' AND lantai = ?';
      params.push(lantai);
    }
    
    query += ' ORDER BY nama_ruang';
    const [rows] = await pool.execute(query, params);
    return rows as Ruang[];
  }

  // Create new room
  static async create(ruang: Ruang): Promise<Ruang> {
    const query = `
      INSERT INTO ruang (nama_ruang, kapasitas, lokasi, lantai, gedung, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      ruang.nama_ruang,
      ruang.kapasitas,
      ruang.lokasi,
      ruang.lantai,
      ruang.gedung,
      ruang.status || 'aktif'
    ];
    
    const [result] = await pool.execute(query, values);
    const insertResult = result as any;
    return { ...ruang, id: insertResult.insertId };
  }

  // Update room
  static async update(id: number, ruang: Partial<Ruang>): Promise<Ruang | null> {
    const fields = Object.keys(ruang).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) return null;
    
    const query = `
      UPDATE ruang 
      SET ${setClause}
      WHERE id = ?
    `;
    
    const values = [...fields.map(field => (ruang as any)[field]), id];
    const [result] = await pool.execute(query, values);
    const updateResult = result as any;
    
    if (updateResult.affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  // Delete room
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM ruang WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  // Get rooms with allocation info for a specific date and time
  static async findWithAllocationInfo(tanggal: string, waktu_mulai: string, waktu_selesai: string): Promise<RuangWithAllocation[]> {
    const query = `
      SELECT 
        r.*,
        COALESCE(SUM(a.jumlah_peserta_dialokasikan), 0) as total_alokasi,
        (r.kapasitas - COALESCE(SUM(a.jumlah_peserta_dialokasikan), 0)) as available_capacity
      FROM ruang r
      LEFT JOIN alokasi a ON r.id = a.ruang_id 
        AND a.tanggal = ? 
        AND a.waktu_mulai = ? 
        AND a.waktu_selesai = ?
        AND a.status != 'dibatalkan'
      WHERE r.status = 'aktif'
      GROUP BY r.id, r.nama_ruang, r.kapasitas, r.lokasi, r.lantai, r.gedung, r.status, r.created_at, r.updated_at
      ORDER BY r.kapasitas DESC, r.nama_ruang
    `;
    
    const [rows] = await pool.execute(query, [tanggal, waktu_mulai, waktu_selesai]);
    return rows as RuangWithAllocation[];
  }

  // Get total room statistics
  static async getStatistics(): Promise<{
    total_rooms: number;
    total_capacity: number;
    active_rooms: number;
    rooms_by_capacity: { capacity: number; count: number }[];
  }> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_rooms,
        SUM(kapasitas) as total_capacity,
        COUNT(CASE WHEN status = 'aktif' THEN 1 END) as active_rooms
      FROM ruang
    `;
    
    const capacityQuery = `
      SELECT 
        kapasitas,
        COUNT(*) as count
      FROM ruang
      WHERE status = 'aktif'
      GROUP BY kapasitas
      ORDER BY kapasitas
    `;
    
    const [statsResult, capacityResult] = await Promise.all([
      pool.execute(statsQuery),
      pool.execute(capacityQuery)
    ]);
    
    const statsRows = statsResult[0] as any[];
    const capacityRows = capacityResult[0] as any[];
    
    return {
      ...statsRows[0],
      rooms_by_capacity: capacityRows
    };
  }
} 