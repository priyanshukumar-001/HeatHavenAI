import { Router } from 'express';
import { handleConcierge, conciergeQuerySchema, handleAdvisor, advisorQuerySchema } from '../controllers/aiController.js';
import { validate } from '../middleware/validate.js';

const router = Router();


router.post('/concierge', validate(conciergeQuerySchema, 'body'), handleConcierge);

router.post('/advisor', validate(advisorQuerySchema, 'body'), handleAdvisor);

export default router;

