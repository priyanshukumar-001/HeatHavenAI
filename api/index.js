import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

// Non-blocking database connection for Vercel Serverless environment
connectDB().catch(() => {
  // In-memory fallback is active
});

export default app;
