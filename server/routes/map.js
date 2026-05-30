import { Router } from 'express';
import { getHeatmap, getPublicMapComplaints } from '../controllers/complaintsController.js';

const router = Router();

router.get('/complaints', getPublicMapComplaints);
router.get('/heatmap', getHeatmap);

export default router;
