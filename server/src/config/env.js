import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server root regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/heathaven',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  OPEN_METEO_CACHE_MIN: parseInt(process.env.OPEN_METEO_CACHE_MIN || '30', 10),
  DEMO_LAT: parseFloat(process.env.DEMO_LAT || '28.570'),
  DEMO_LNG: parseFloat(process.env.DEMO_LNG || '77.326'),
  ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || 'heathaven2026'
};

