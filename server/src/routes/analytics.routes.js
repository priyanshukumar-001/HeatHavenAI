import { Router } from 'express';
import { handleGetHeatGap, heatGapQuerySchema, handleGetAqi } from '../controllers/analyticsController.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.get('/heat-gap', validate(heatGapQuerySchema, 'query'), handleGetHeatGap);

router.get('/aqi', handleGetAqi);

export default router;

