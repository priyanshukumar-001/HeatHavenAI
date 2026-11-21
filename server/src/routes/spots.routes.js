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


router.get('/nearby', validate(nearbyQuerySchema, 'query'), handleGetNearby);
router.post('/:id/report', validate(reportBodySchema, 'body'), handlePostReport);


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
