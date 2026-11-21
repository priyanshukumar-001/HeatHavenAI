import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

/**
 * Bootstrap the server: connect DB (non-blocking), then listen.
 * Server starts even if MongoDB is offline — in-memory fallback activates.
 */
async function bootstrap() {
  // Attempt DB connection but never block server startup
  connectDB().catch(() => {
    // MongoDB offline — in-memory fallback is active
  });

  app.listen(ENV.PORT, () => {
    // Server is listening on ENV.PORT
  });
}

bootstrap().catch(() => {
  process.exit(1);
});

