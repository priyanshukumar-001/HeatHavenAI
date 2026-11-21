import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import spotsRouter from './routes/spots.routes.js';
import aiRouter from './routes/ai.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import authRouter from './routes/auth.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { isDbConnected } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

export const app = express();

// Security and CORS configuration (Support Render, Vercel, and local development)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint with Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    database: isDbConnected() ? 'connected' : 'offline_in_memory',
    geminiAi: ENV.GEMINI_API_KEY ? 'configured' : 'fallback_mode',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/spots', spotsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Serve Static Frontend Assets in Production (Fullstack Single-Instance on Render/Vercel)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API requests
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
