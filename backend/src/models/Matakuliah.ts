import pool from '../config/database';

export interface Matakuliah {
  id?: number;
  kode_mk: string;
  nama_mk: string;
  jumlah_peserta: number;
  dosen?: string;
  semester?: string;
  tahun_ajaran?: string;
  status?: 'aktif' | 'selesai' | 'dibatalkan';
  created_at?: Date;
  updated_at?: Date;
}

export interface MatakuliahWithAllocation extends Matakuliah {
  total_alokasi?: number;
  total_ruang?: number;
  alokasi_details?: any[];
}

export class MatakuliahModel {
  // Get all courses
  static async findAll(): Promise<Matakuliah[]> {
    const query = 'SELECT * FROM matakuliah ORDER BY nama_mk';
    const [rows] = await pool.execute(query);
    return rows as Matakuliah[];
  }

  // Get course by ID
  static async findById(id: number): Promise<Matakuliah | null> {
    const query = 'SELECT * FROM matakuliah WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    const result = rows as Matakuliah[];
    return result[0] || null;
  }

  // Get course by code
  static async findByKode(kode_mk: string): Promise<Matakuliah | null> {
    const query = 'SELECT * FROM matakuliah WHERE kode_mk = ?';
    const [rows] = await pool.execute(query, [kode_mk]);
    const result = rows as Matakuliah[];
    return result[0] || null;
  }

  // Get active courses
  static async findActive(): Promise<Matakuliah[]> {
    const query = 'SELECT * FROM matakuliah WHERE status = ? ORDER BY nama_mk';
    const [rows] = await pool.execute(query, ['aktif']);
    return rows as Matakuliah[];
  }

  // Get courses by semester and academic year
  static async findBySemester(semester: string, tahun_ajaran: string): Promise<Matakuliah[]> {
    const query = 'SELECT * FROM matakuliah WHERE semester = ? AND tahun_ajaran = ? ORDER BY nama_mk';
    const [rows] = await pool.execute(query, [semester, tahun_ajaran]);
    return rows as Matakuliah[];
  }

  // Get courses that need room allocation (active courses without complete allocation)
  static async findNeedingAllocation(): Promise<Matakuliah[]> {
    const query = `
      SELECT m.*
      FROM matakuliah m
      LEFT JOIN (
        SELECT matakuliah_id, SUM(jumlah_peserta_dialokasikan) as total_dialokasikan
        FROM alokasi
        WHERE status != 'dibatalkan'
        GROUP BY matakuliah_id
      ) a ON m.id = a.matakuliah_id
      WHERE m.status = 'aktif'
        AND (a.total_dialokasikan IS NULL OR a.total_dialokasikan < m.jumlah_peserta)
      ORDER BY m.jumlah_peserta DESC
    `;
    const [rows] = await pool.execute(query);
    return rows as Matakuliah[];
  }

  // Create new course
  static async create(matakuliah: Matakuliah): Promise<Matakuliah> {
    const query = `
      INSERT INTO matakuliah (kode_mk, nama_mk, jumlah_peserta, dosen, semester, tahun_ajaran, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      matakuliah.kode_mk,
      matakuliah.nama_mk,
      matakuliah.jumlah_peserta,
      matakuliah.dosen,
      matakuliah.semester,
      matakuliah.tahun_ajaran,
      matakuliah.status || 'aktif'
    ];
    
    const [result] = await pool.execute(query, values);
    const insertResult = result as any;
    return { ...matakuliah, id: insertResult.insertId };
  }

  // Update course
  static async update(id: number, matakuliah: Partial<Matakuliah>): Promise<Matakuliah | null> {
    const fields = Object.keys(matakuliah).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) return null;
    
    const query = `
      UPDATE matakuliah 
      SET ${setClause}
      WHERE id = ?
    `;
    
    const values = [...fields.map(field => (matakuliah as any)[field]), id];
    const [result] = await pool.execute(query, values);
    const updateResult = result as any;
    
    if (updateResult.affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  // Delete course
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM matakuliah WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  // Get course with allocation details
  static async findWithAllocationDetails(id: number): Promise<MatakuliahWithAllocation | null> {
    const query = `
      SELECT 
        m.*,
        COALESCE(SUM(a.jumlah_peserta_dialokasikan), 0) as total_alokasi,
        COUNT(DISTINCT a.ruang_id) as total_ruang
      FROM matakuliah m
      LEFT JOIN alokasi a ON m.id = a.matakuliah_id AND a.status != 'dibatalkan'
      WHERE m.id = ?
      GROUP BY m.id, m.kode_mk, m.nama_mk, m.jumlah_peserta, m.dosen, m.semester, m.tahun_ajaran, m.status, m.created_at, m.updated_at
    `;
    
    const [rows] = await pool.execute(query, [id]);
    const result = rows as any[];
    if (!result[0]) return null;
    
    // Get allocation details
    const allocationQuery = `
      SELECT 
        a.*,
        r.nama_ruang,
        r.kapasitas,
        r.lokasi,
        r.lantai,
        r.gedung
      FROM alokasi a
      JOIN ruang r ON a.ruang_id = r.id
      WHERE a.matakuliah_id = ? AND a.status != 'dibatalkan'
      ORDER BY a.nomor_urut, a.ruang_id
    `;
    
    const [allocationRows] = await pool.execute(allocationQuery, [id]);
    
    return {
      ...result[0],
      alokasi_details: allocationRows
    };
  }

  // Get courses with allocation summary
  static async findAllWithAllocationSummary(): Promise<MatakuliahWithAllocation[]> {
    const query = `
      SELECT 
        m.*,
        COALESCE(SUM(a.jumlah_peserta_dialokasikan), 0) as total_alokasi,
        COUNT(DISTINCT a.ruang_id) as total_ruang
      FROM matakuliah m
      LEFT JOIN alokasi a ON m.id = a.matakuliah_id AND a.status != 'dibatalkan'
      GROUP BY m.id, m.kode_mk, m.nama_mk, m.jumlah_peserta, m.dosen, m.semester, m.tahun_ajaran, m.status, m.created_at, m.updated_at
      ORDER BY m.nama_mk
    `;
    
    const [rows] = await pool.execute(query);
    return rows as MatakuliahWithAllocation[];
  }

  // Get course statistics
  static async getStatistics(): Promise<{
    total_courses: number;
    active_courses: number;
    total_participants: number;
    courses_by_participants: { range: string; count: number }[];
  }> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_courses,
        COUNT(CASE WHEN status = 'aktif' THEN 1 END) as active_courses,
        SUM(jumlah_peserta) as total_participants
      FROM matakuliah
    `;
    
    const rangeQuery = `
      SELECT 
        CASE 
          WHEN jumlah_peserta <= 25 THEN '1-25'
          WHEN jumlah_peserta <= 30 THEN '26-30'
          WHEN jumlah_peserta <= 55 THEN '31-55'
          ELSE '55+'
        END as range,
        COUNT(*) as count
      FROM matakuliah
      WHERE status = 'aktif'
      GROUP BY 
        CASE 
          WHEN jumlah_peserta <= 25 THEN '1-25'
          WHEN jumlah_peserta <= 30 THEN '26-30'
          WHEN jumlah_peserta <= 55 THEN '31-55'
          ELSE '55+'
        END
      ORDER BY range
    `;
    
    const [statsResult, rangeResult] = await Promise.all([
      pool.execute(statsQuery),
      pool.execute(rangeQuery)
    ]);
    
    const statsRows = statsResult[0] as any[];
    const rangeRows = rangeResult[0] as any[];
    
    return {
      ...statsRows[0],
      courses_by_participants: rangeRows
    };
  }

  // Bulk create courses
  static async bulkCreate(courses: Matakuliah[]): Promise<Matakuliah[]> {
    const createdCourses: Matakuliah[] = [];
    
    for (const course of courses) {
      const created = await this.create(course);
      createdCourses.push(created);
    }
    
    return createdCourses;
  }
} 