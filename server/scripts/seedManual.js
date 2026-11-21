import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Spot } from '../src/models/Spot.js';
import { ENV } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedManualData() {
  const manualPath = path.resolve(__dirname, '../data/manual-spots.json');
  if (!fs.existsSync(manualPath)) {
    process.exit(1);
  }

  const spots = JSON.parse(fs.readFileSync(manualPath, 'utf8'));

  await mongoose.connect(ENV.MONGODB_URI);

  let count = 0;
  for (const s of spots) {
    await Spot.findOneAndUpdate(
      { name: s.name },
      {
        ...s,
        lastVerifiedAt: new Date()
      },
      { upsert: true, new: true }
    );
    count++;
  }

  await mongoose.disconnect();
}

seedManualData().catch((_err) => {
  process.exit(1);
});

