import { Router } from 'express';
import multer from 'multer';
import {
  handleGetNearby,
  handlePostReport,
  nearbyQuerySchema,
  reportBodySchema
} from '../controllers/spotsController.js';
import { verifySpotPhoto } from '../services/photoService.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/spots/nearby
router.get('/nearby', validate(nearbyQuerySchema, 'query'), handleGetNearby);

// POST /api/spots/:id/report (SPEC Section 5.3 & 5.5)
router.post('/:id/report', validate(reportBodySchema, 'body'), handlePostReport);

// POST /api/spots/verify-photo (SPEC Section 5.3 & Phase 7)
router.post('/verify-photo', upload.single('photo'), async (req, res, next) => {
  try {
    const { spotId } = req.body;
    const buffer = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : 'image/jpeg';

    const result = await verifySpotPhoto({
      spotId,
      imageBuffer: buffer,
      mimeType
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
