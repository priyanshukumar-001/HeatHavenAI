import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Spot } from '../src/models/Spot.js';
import { ENV } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importOsmData() {
  const geojsonPath = path.resolve(__dirname, '../data/noida-osm.geojson');
  if (!fs.existsSync(geojsonPath)) {
    // File missing
    process.exit(1);
  }

  const raw = fs.readFileSync(geojsonPath, 'utf8');
  const geojson = JSON.parse(raw);

  await mongoose.connect(ENV.MONGODB_URI);

  let insertedCount = 0;
  for (const feature of geojson.features) {
    const { name, category } = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    await Spot.findOneAndUpdate(
      { 'location.coordinates': [lng, lat], source: 'osm' },
      {
        name: name || 'Public Relief Spot',
        category: category || 'water',
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        source: 'osm',
        lastVerifiedAt: new Date(),
        trustScore: 75,
        status: 'verified',
        reportCounts: { ok: 5, dry: 0, closed: 0 },
        aiVerified: false,
        isSimulated: false
      },
      { upsert: true, new: true }
    );
    insertedCount++;
  }

  await mongoose.disconnect();
}

importOsmData().catch((_err) => {
  process.exit(1);
});

