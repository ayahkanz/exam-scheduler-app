import { Router } from 'express';
import { AllocationController } from '../controllers/AllocationController';

const router = Router();

// POST /api/allocation/auto - Auto allocate rooms
router.post('/auto', AllocationController.autoAllocate);

// GET /api/allocation/summary - Get allocation summary
router.get('/summary', AllocationController.getSummary);

// POST /api/allocation/check-conflicts - Check for allocation conflicts
router.post('/check-conflicts', AllocationController.checkConflicts);

// POST /api/allocation/preview - Get allocation preview
router.post('/preview', AllocationController.getPreview);

// GET /api/allocation/statistics - Get allocation statistics
router.get('/statistics', AllocationController.getStatistics);

export default router; 