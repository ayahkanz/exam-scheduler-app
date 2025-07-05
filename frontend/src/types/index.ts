// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Room types
export interface Room {
  id: number;
  nama_ruang: string;
  kapasitas: number;
  lokasi?: string;
  lantai?: number;
  gedung?: string;
  status: 'aktif' | 'nonaktif' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface RoomWithAllocation extends Room {
  total_alokasi?: number;
  available_capacity?: number;
}

export interface RoomStatistics {
  total_rooms: number;
  total_capacity: number;
  active_rooms: number;
  rooms_by_capacity: { capacity: number; count: number }[];
}

// Course types
export interface Course {
  id: number;
  kode_mk: string;
  nama_mk: string;
  jumlah_peserta: number;
  dosen?: string;
  semester?: string;
  tahun_ajaran?: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  created_at: string;
  updated_at: string;
}

export interface CourseWithAllocation extends Course {
  total_alokasi?: number;
  total_ruang?: number;
  alokasi_details?: AllocationDetail[];
}

// Allocation types
export interface AllocationRequest {
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  matakuliah_ids?: number[];
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

export interface AllocationResult {
  matakuliah_id: number;
  matakuliah_nama: string;
  jumlah_peserta: number;
  allocations: RoomAllocation[];
  total_waste: number;
  success: boolean;
  message?: string;
}

export interface AllocationDetail {
  id: number;
  matakuliah_id: number;
  ruang_id: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  nomor_urut: number;
  jumlah_peserta_dialokasikan: number;
  status: string;
  nama_ruang: string;
  kapasitas: number;
  lokasi: string;
  lantai: number;
  gedung: string;
}

export interface AllocationSummary {
  total_courses: number;
  total_allocations: number;
  total_participants: number;
  total_waste: number;
  room_utilization: { ruang_nama: string; utilization_percentage: number }[];
}

export interface AllocationConflict {
  ruang_nama: string;
  existing_matakuliah: string;
  conflicting_matakuliah: string;
}

export interface ConflictCheckResult {
  has_conflicts: boolean;
  conflicts: AllocationConflict[];
}

// Student types
export interface Student {
  id: number;
  nim: string;
  nama: string;
  email?: string;
  program_studi?: string;
  angkatan?: number;
  created_at: string;
  updated_at: string;
}

// Form types
export interface RoomFormData {
  nama_ruang: string;
  kapasitas: number;
  lokasi?: string;
  lantai?: number;
  gedung?: string;
  status?: 'aktif' | 'nonaktif' | 'maintenance';
}

export interface CourseFormData {
  kode_mk: string;
  nama_mk: string;
  jumlah_peserta: number;
  dosen?: string;
  semester?: string;
  tahun_ajaran?: string;
  status?: 'aktif' | 'selesai' | 'dibatalkan';
}

export interface AllocationFormData {
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  matakuliah_ids: number[];
}

// Dashboard types
export interface DashboardStats {
  total_rooms: number;
  total_courses: number;
  total_students: number;
  total_allocations: number;
  room_utilization: number;
  upcoming_exams: number;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// Table types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'input' | 'date' | 'number';
  options?: FilterOption[];
  placeholder?: string;
}

// Chart types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
} 