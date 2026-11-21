import { Router } from 'express';
import { handleGetHeatGap, heatGapQuerySchema, handleGetAqi } from '../controllers/analyticsController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// GET /api/analytics/heat-gap (SPEC Section 5.3 & 5.7)
router.get('/heat-gap', validate(heatGapQuerySchema, 'query'), handleGetHeatGap);

// GET /api/analytics/aqi - Real-time Air Quality Data
router.get('/aqi', handleGetAqi);

export default router;

