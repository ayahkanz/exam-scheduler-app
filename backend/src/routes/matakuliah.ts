import express from 'express';
import { MatakuliahController } from '../controllers/MatakuliahController';

const router = express.Router();

// Get all courses
router.get('/', MatakuliahController.getAll);

// Get active courses
router.get('/active', MatakuliahController.getActive);

// Get courses with allocation summary
router.get('/with-allocation', MatakuliahController.getAllWithAllocationSummary);

// Get courses by semester and academic year
router.get('/by-semester', MatakuliahController.getBySemester);

// Get courses needing allocation
router.get('/needing-allocation', MatakuliahController.getNeedingAllocation);

// Get course statistics
router.get('/statistics', MatakuliahController.getStatistics);

// Get course by ID
router.get('/:id', MatakuliahController.getById);

// Get course with allocation details
router.get('/:id/with-allocation', MatakuliahController.getWithAllocationDetails);

// Create new course
router.post('/', MatakuliahController.create);

// Update course
router.put('/:id', MatakuliahController.update);

// Delete course
router.delete('/:id', MatakuliahController.delete);

export default router; 