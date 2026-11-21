import { Router } from 'express';
import { handleLoginOrRegister, handleAddContribution, authBodySchema } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();


router.post('/login', validate(authBodySchema, 'body'), handleLoginOrRegister);


router.post('/:userId/contribute', handleAddContribution);

export default router;

