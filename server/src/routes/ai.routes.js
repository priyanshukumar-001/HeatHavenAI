import { Router } from 'express';
import { handleConcierge, conciergeQuerySchema, handleAdvisor, advisorQuerySchema } from '../controllers/aiController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /api/ai/concierge (SPEC Section 5.3 & 5.6)
router.post('/concierge', validate(conciergeQuerySchema, 'body'), handleConcierge);

// POST /api/ai/advisor — Gemini-powered heat safety advisor
router.post('/advisor', validate(advisorQuerySchema, 'body'), handleAdvisor);

export default router;

