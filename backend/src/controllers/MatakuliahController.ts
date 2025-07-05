import { Request, Response } from 'express';
import { MatakuliahModel, Matakuliah } from '../models/Matakuliah';

export class MatakuliahController {
  // Get all courses
  static async getAll(req: Request, res: Response) {
    try {
      const courses = await MatakuliahModel.findAll();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get course by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const course = await MatakuliahModel.findById(id);
      
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      
      res.json(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get active courses
  static async getActive(req: Request, res: Response) {
    try {
      const courses = await MatakuliahModel.findActive();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching active courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new course
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const courseData: Matakuliah = req.body;
      
      // Validation
      if (!courseData.kode_mk || !courseData.nama_mk || !courseData.jumlah_peserta) {
        res.status(400).json({ 
          error: 'Kode matakuliah, nama matakuliah, dan jumlah peserta harus diisi' 
        });
        return;
      }

      if (courseData.jumlah_peserta <= 0) {
        res.status(400).json({ 
          error: 'Jumlah peserta harus lebih dari 0' 
        });
        return;
      }

      // Check if course code already exists
      const existingCourse = await MatakuliahModel.findByKode(courseData.kode_mk);
      if (existingCourse) {
        res.status(400).json({ 
          error: 'Kode matakuliah sudah ada' 
        });
        return;
      }

      const newCourse = await MatakuliahModel.create(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update course
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: Partial<Matakuliah> = req.body;
      
      // Check if course exists
      const existingCourse = await MatakuliahModel.findById(id);
      if (!existingCourse) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      // Validation
      if (updateData.jumlah_peserta !== undefined && updateData.jumlah_peserta <= 0) {
        res.status(400).json({ 
          error: 'Jumlah peserta harus lebih dari 0' 
        });
        return;
      }

      // Check if new code conflicts with existing course
      if (updateData.kode_mk && updateData.kode_mk !== existingCourse.kode_mk) {
        const courseWithCode = await MatakuliahModel.findByKode(updateData.kode_mk);
        if (courseWithCode) {
          res.status(400).json({ 
            error: 'Kode matakuliah sudah ada' 
          });
          return;
        }
      }

      const updatedCourse = await MatakuliahModel.update(id, updateData);
      if (!updatedCourse) {
        res.status(500).json({ error: 'Failed to update course' });
        return;
      }
      
      res.json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete course
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      // Check if course exists
      const existingCourse = await MatakuliahModel.findById(id);
      if (!existingCourse) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const deleted = await MatakuliahModel.delete(id);
      if (!deleted) {
        res.status(500).json({ error: 'Failed to delete course' });
        return;
      }
      
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get course with allocation details
  static async getWithAllocationDetails(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const course = await MatakuliahModel.findWithAllocationDetails(id);
      
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      
      res.json(course);
    } catch (error) {
      console.error('Error fetching course with allocation details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get courses with allocation summary
  static async getAllWithAllocationSummary(req: Request, res: Response) {
    try {
      const courses = await MatakuliahModel.findAllWithAllocationSummary();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses with allocation summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get course statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const stats = await MatakuliahModel.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get courses by semester and academic year
  static async getBySemester(req: Request, res: Response): Promise<void> {
    try {
      const { semester, tahun_ajaran } = req.query;
      
      if (!semester || !tahun_ajaran) {
        res.status(400).json({ 
          error: 'Semester dan tahun ajaran harus diisi' 
        });
        return;
      }

      const courses = await MatakuliahModel.findBySemester(
        semester as string, 
        tahun_ajaran as string
      );
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses by semester:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get courses needing allocation
  static async getNeedingAllocation(req: Request, res: Response) {
    try {
      const courses = await MatakuliahModel.findNeedingAllocation();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses needing allocation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 