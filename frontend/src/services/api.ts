import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  Room, 
  RoomWithAllocation, 
  RoomStatistics,
  Course,
  CourseWithAllocation,
  AllocationRequest,
  AllocationResult,
  AllocationSummary,
  ConflictCheckResult,
  RoomFormData,
  CourseFormData
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Room API functions
export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get('/ruang');
  return response.data.data;
};

export const createRoom = async (data: RoomFormData): Promise<Room> => {
  const response = await api.post('/ruang', data);
  return response.data.data;
};

export const updateRoom = async (data: { id: number } & Partial<RoomFormData>): Promise<Room> => {
  const { id, ...roomData } = data;
  const response = await api.put(`/ruang/${id}`, roomData);
  return response.data.data;
};

export const deleteRoom = async (id: number): Promise<boolean> => {
  const response = await api.delete(`/ruang/${id}`);
  return response.data.data;
};

// Room API
export const roomApi = {
  // Get all rooms
  getAll: (): Promise<AxiosResponse<ApiResponse<Room[]>>> => 
    api.get('/ruang'),
  
  // Get room by ID
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Room>>> => 
    api.get(`/ruang/${id}`),
  
  // Get room statistics
  getStatistics: (): Promise<AxiosResponse<ApiResponse<RoomStatistics>>> => 
    api.get('/ruang/statistics'),
  
  // Get rooms with allocation info
  getWithAllocation: (params: { tanggal: string; waktu_mulai: string; waktu_selesai: string }): Promise<AxiosResponse<ApiResponse<RoomWithAllocation[]>>> => 
    api.get('/ruang/with-allocation', { params }),
  
  // Get rooms by capacity
  getByCapacity: (min: number, max?: number): Promise<AxiosResponse<ApiResponse<Room[]>>> => 
    api.get('/ruang/by-capacity', { params: { min, max } }),
  
  // Get rooms by location
  getByLocation: (gedung?: string, lantai?: number): Promise<AxiosResponse<ApiResponse<Room[]>>> => 
    api.get('/ruang/by-location', { params: { gedung, lantai } }),
  
  // Create room
  create: (data: RoomFormData): Promise<AxiosResponse<ApiResponse<Room>>> => 
    api.post('/ruang', data),
  
  // Update room
  update: (id: number, data: Partial<RoomFormData>): Promise<AxiosResponse<ApiResponse<Room>>> => 
    api.put(`/ruang/${id}`, data),
  
  // Delete room
  delete: (id: number): Promise<AxiosResponse<ApiResponse<boolean>>> => 
    api.delete(`/ruang/${id}`),
};

// Course API
export const courseApi = {
  // Get all courses
  getAll: (): Promise<AxiosResponse<ApiResponse<Course[]>>> => 
    api.get('/matakuliah'),
  
  // Get course by ID
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Course>>> => 
    api.get(`/matakuliah/${id}`),
  
  // Get active courses
  getActive: (): Promise<AxiosResponse<ApiResponse<Course[]>>> => 
    api.get('/matakuliah/active'),
  
  // Get courses with allocation summary
  getAllWithAllocation: (): Promise<AxiosResponse<ApiResponse<CourseWithAllocation[]>>> => 
    api.get('/matakuliah/with-allocation'),
  
  // Get courses by semester
  getBySemester: (semester: string, tahun_ajaran: string): Promise<AxiosResponse<ApiResponse<Course[]>>> => 
    api.get('/matakuliah/by-semester', { params: { semester, tahun_ajaran } }),
  
  // Get courses needing allocation
  getNeedingAllocation: (): Promise<AxiosResponse<ApiResponse<Course[]>>> => 
    api.get('/matakuliah/needing-allocation'),
  
  // Get course statistics
  getStatistics: (): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get('/matakuliah/statistics'),
  
  // Get course with allocation details
  getWithAllocation: (id: number): Promise<AxiosResponse<ApiResponse<CourseWithAllocation>>> => 
    api.get(`/matakuliah/${id}/with-allocation`),
  
  // Create course
  create: (data: CourseFormData): Promise<AxiosResponse<ApiResponse<Course>>> => 
    api.post('/matakuliah', data),
  
  // Update course
  update: (id: number, data: Partial<CourseFormData>): Promise<AxiosResponse<ApiResponse<Course>>> => 
    api.put(`/matakuliah/${id}`, data),
  
  // Delete course
  delete: (id: number): Promise<AxiosResponse<ApiResponse<boolean>>> => 
    api.delete(`/matakuliah/${id}`),
  
  // Bulk import courses
  bulkImport: (data: CourseFormData[]): Promise<AxiosResponse<ApiResponse<Course[]>>> => 
    api.post('/matakuliah/bulk', data),
};

// Allocation API
export const allocationApi = {
  // Auto allocate rooms
  autoAllocate: (data: AllocationRequest): Promise<AxiosResponse<ApiResponse<{ results: AllocationResult[]; summary: any }>>> => 
    api.post('/allocation/auto', data),
  
  // Get allocation summary
  getSummary: (params: { tanggal: string; waktu_mulai: string; waktu_selesai: string }): Promise<AxiosResponse<ApiResponse<AllocationSummary>>> => 
    api.get('/allocation/summary', { params }),
  
  // Check conflicts
  checkConflicts: (data: AllocationRequest): Promise<AxiosResponse<ApiResponse<ConflictCheckResult>>> => 
    api.post('/allocation/check-conflicts', data),
  
  // Get allocation preview
  getPreview: (data: AllocationRequest): Promise<AxiosResponse<ApiResponse<{ preview: AllocationResult[]; summary: any }>>> => 
    api.post('/allocation/preview', data),
  
  // Get allocation statistics
  getStatistics: (params: { start_date: string; end_date: string }): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get('/allocation/statistics', { params }),
};

// Health check
export const healthApi = {
  check: (): Promise<AxiosResponse<ApiResponse>> => 
    api.get('/health'),
};

export default api; 