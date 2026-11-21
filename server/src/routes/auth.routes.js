import { Router } from 'express';
import { handleLoginOrRegister, handleAddContribution, authBodySchema } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /api/auth/login (Login or Register)
router.post('/login', validate(authBodySchema, 'body'), handleLoginOrRegister);

// POST /api/auth/:userId/contribute
router.post('/:userId/contribute', handleAddContribution);

export default router;

