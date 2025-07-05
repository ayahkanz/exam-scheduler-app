import { Request, Response } from 'express';
import { RuangModel, Ruang } from '../models/Ruang';
import Joi from 'joi';

// Validation schemas
const createRuangSchema = Joi.object({
  nama_ruang: Joi.string().required().max(50),
  kapasitas: Joi.number().integer().positive().required(),
  lokasi: Joi.string().max(100).optional(),
  lantai: Joi.number().integer().min(1).optional(),
  gedung: Joi.string().max(50).optional(),
  status: Joi.string().valid('aktif', 'nonaktif', 'maintenance').optional()
});

const updateRuangSchema = Joi.object({
  nama_ruang: Joi.string().max(50).optional(),
  kapasitas: Joi.number().integer().positive().optional(),
  lokasi: Joi.string().max(100).optional(),
  lantai: Joi.number().integer().min(1).optional(),
  gedung: Joi.string().max(50).optional(),
  status: Joi.string().valid('aktif', 'nonaktif', 'maintenance').optional()
});

export class RuangController {
  // Get all rooms
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await RuangModel.findAll();
      res.json({
        success: true,
        data: rooms,
        message: 'Berhasil mengambil data ruang'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get room by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID ruang harus berupa angka'
        });
        return;
      }

      const room = await RuangModel.findById(id);
      if (!room) {
        res.status(404).json({
          success: false,
          message: 'Ruang tidak ditemukan'
        });
        return;
      }

      res.json({
        success: true,
        data: room,
        message: 'Berhasil mengambil data ruang'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get rooms by capacity
  static async getByCapacity(req: Request, res: Response): Promise<void> {
    try {
      const minCapacity = parseInt(req.query.min as string);
      const maxCapacity = req.query.max ? parseInt(req.query.max as string) : undefined;

      if (isNaN(minCapacity)) {
        res.status(400).json({
          success: false,
          message: 'Parameter min capacity harus berupa angka'
        });
        return;
      }

      const rooms = await RuangModel.findAvailableByCapacity(minCapacity, maxCapacity);
      res.json({
        success: true,
        data: rooms,
        message: 'Berhasil mengambil data ruang berdasarkan kapasitas'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get rooms by location
  static async getByLocation(req: Request, res: Response): Promise<void> {
    try {
      const gedung = req.query.gedung as string;
      const lantai = req.query.lantai ? parseInt(req.query.lantai as string) : undefined;

      if (lantai !== undefined && isNaN(lantai)) {
        res.status(400).json({
          success: false,
          message: 'Parameter lantai harus berupa angka'
        });
        return;
      }

      const rooms = await RuangModel.findByLocation(gedung, lantai);
      res.json({
        success: true,
        data: rooms,
        message: 'Berhasil mengambil data ruang berdasarkan lokasi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new room
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createRuangSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          error: error.details[0].message
        });
        return;
      }

      // Check if room name already exists
      const existingRoom = await RuangModel.findByNama(value.nama_ruang);
      if (existingRoom) {
        res.status(409).json({
          success: false,
          message: 'Nama ruang sudah ada'
        });
        return;
      }

      const room = await RuangModel.create(value);
      res.status(201).json({
        success: true,
        data: room,
        message: 'Ruang berhasil dibuat'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal membuat ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update room
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID ruang harus berupa angka'
        });
        return;
      }

      const { error, value } = updateRuangSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Data tidak valid',
          error: error.details[0].message
        });
        return;
      }

      // Check if room exists
      const existingRoom = await RuangModel.findById(id);
      if (!existingRoom) {
        res.status(404).json({
          success: false,
          message: 'Ruang tidak ditemukan'
        });
        return;
      }

      // Check if new name conflicts with existing room
      if (value.nama_ruang && value.nama_ruang !== existingRoom.nama_ruang) {
        const roomWithSameName = await RuangModel.findByNama(value.nama_ruang);
        if (roomWithSameName) {
          res.status(409).json({
            success: false,
            message: 'Nama ruang sudah ada'
          });
          return;
        }
      }

      const updatedRoom = await RuangModel.update(id, value);
      if (!updatedRoom) {
        res.status(500).json({
          success: false,
          message: 'Gagal mengupdate ruang'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedRoom,
        message: 'Ruang berhasil diupdate'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete room
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID ruang harus berupa angka'
        });
        return;
      }

      // Check if room exists
      const existingRoom = await RuangModel.findById(id);
      if (!existingRoom) {
        res.status(404).json({
          success: false,
          message: 'Ruang tidak ditemukan'
        });
        return;
      }

      const deleted = await RuangModel.delete(id);
      if (!deleted) {
        res.status(500).json({
          success: false,
          message: 'Gagal menghapus ruang'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Ruang berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get room statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await RuangModel.getStatistics();
      res.json({
        success: true,
        data: stats,
        message: 'Berhasil mengambil statistik ruang'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil statistik ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get rooms with allocation info
  static async getWithAllocationInfo(req: Request, res: Response): Promise<void> {
    try {
      const { tanggal, waktu_mulai, waktu_selesai } = req.query;

      if (!tanggal || !waktu_mulai || !waktu_selesai) {
        res.status(400).json({
          success: false,
          message: 'Parameter tanggal, waktu_mulai, dan waktu_selesai harus disediakan'
        });
        return;
      }

      const rooms = await RuangModel.findWithAllocationInfo(
        tanggal as string,
        waktu_mulai as string,
        waktu_selesai as string
      );

      res.json({
        success: true,
        data: rooms,
        message: 'Berhasil mengambil data ruang dengan informasi alokasi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data ruang',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 