import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './env.js';
import { Spot } from '../models/Spot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;

// Do not buffer commands when disconnected so fallback is instant
mongoose.set('bufferCommands', false);

/**
 * Automatically populate MongoDB with ground data and 2dsphere indexes on first deployment
 */
async function autoSeedIfEmpty() {
  try {
    const count = await Spot.countDocuments();
    if (count === 0) {
      const manualPath = path.resolve(__dirname, '../../data/manual-spots.json');
      if (fs.existsSync(manualPath)) {
        const raw = fs.readFileSync(manualPath, 'utf8');
        const spots = JSON.parse(raw);
        for (const s of spots) {
          await Spot.create({
            ...s,
            lastVerifiedAt: new Date()
          });
        }
      }
    }
  } catch {
    // Non-fatal if auto-seed fails
  }
}

/**
 * Connect to MongoDB with automatic retry and error capture.
 * @returns {Promise<boolean>} Whether connection succeeded
 */
export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      autoIndex: true
    });
    isConnected = conn.connections[0].readyState === 1;
    if (isConnected) {
      await autoSeedIfEmpty();
    }
    return isConnected;
  } catch {
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
