import { Router } from 'express';
import {
  getAdminStats,
  getBroadcast,
  updateBroadcast,
  getDispatchRecommendations,
  createOfficialSpot
} from '../controllers/adminController.js';
import { ENV } from '../config/env.js';

const router = Router();

function requireAdminKey(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key !== ENV.ADMIN_PASSKEY) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Invalid or missing admin passkey' }
    });
  }
  next();
}

router.get('/stats', getAdminStats);
router.get('/broadcast', getBroadcast);
router.post('/broadcast', requireAdminKey, updateBroadcast);
router.get('/dispatch-recommendations', getDispatchRecommendations);
router.post('/spots', requireAdminKey, createOfficialSpot);

export const adminRouter = router;
