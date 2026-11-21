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

/**
 * Admin passkey gate — write operations (POST) require x-admin-key header.
 * Read operations (GET /stats, /broadcast, /dispatch-recommendations) are open
 * so the client can display data, but mutations are protected.
 */
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
