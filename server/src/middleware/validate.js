import { z } from 'zod';

/**
 * Middleware factory to validate Express request queries or bodies against Zod schemas
 * @param {z.ZodSchema} schema 
 * @param {'query' | 'body' | 'params'} [source='query']
 */
export function validate(schema, source = 'query') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
          }
        });
      }
      next(err);
    }
  };
}

