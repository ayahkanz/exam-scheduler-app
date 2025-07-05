import { Router } from 'express';
import { RuangController } from '../controllers/RuangController';

const router = Router();

// GET /api/ruang - Get all rooms
router.get('/', RuangController.getAll);

// GET /api/ruang/statistics - Get room statistics
router.get('/statistics', RuangController.getStatistics);

// GET /api/ruang/with-allocation - Get rooms with allocation info
router.get('/with-allocation', RuangController.getWithAllocationInfo);

// GET /api/ruang/by-capacity - Get rooms by capacity
router.get('/by-capacity', RuangController.getByCapacity);

// GET /api/ruang/by-location - Get rooms by location
router.get('/by-location', RuangController.getByLocation);

// GET /api/ruang/:id - Get room by ID
router.get('/:id', RuangController.getById);

// POST /api/ruang - Create new room
router.post('/', RuangController.create);

// PUT /api/ruang/:id - Update room
router.put('/:id', RuangController.update);

// DELETE /api/ruang/:id - Delete room
router.delete('/:id', RuangController.delete);

export default router; 