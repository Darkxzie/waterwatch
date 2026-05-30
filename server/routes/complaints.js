import { Router } from 'express';
import {
  createComplaint,
  getComplaintById,
  getHeatmap,
  getMyComplaints,
  getPublicMapComplaints,
  upvoteComplaint
} from '../controllers/complaintsController.js';
import { requireAuth } from '../middleware/auth.js';
import { complaintRateLimit } from '../middleware/rateLimit.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/public/map', getPublicMapComplaints);
router.get('/public/heatmap', getHeatmap);
router.post('/', requireAuth, complaintRateLimit, upload.single('photo'), createComplaint);
router.get('/mine', requireAuth, getMyComplaints);
router.get('/:id', requireAuth, getComplaintById);
router.post('/:id/upvote', requireAuth, upvoteComplaint);

export default router;
