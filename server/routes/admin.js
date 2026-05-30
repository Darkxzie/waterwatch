import { Router } from 'express';
import {
  assignComplaint,
  getAllComplaints,
  getResolutionTime,
  getSummary,
  getTrends,
  updateComplaintStatus
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('AUTHORITY', 'ADMIN'));
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.patch('/complaints/:id/assign', assignComplaint);
router.get('/analytics/summary', getSummary);
router.get('/analytics/trends', getTrends);
router.get('/analytics/resolution-time', getResolutionTime);

export default router;
