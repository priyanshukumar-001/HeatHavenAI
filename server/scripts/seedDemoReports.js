import mongoose from 'mongoose';
import { Spot } from '../src/models/Spot.js';
import { Report } from '../src/models/Report.js';
import { ENV } from '../src/config/env.js';
import { hashDeviceId } from '../src/utils/hash.js';

async function seedDemoReports() {
  await mongoose.connect(ENV.MONGODB_URI);

  const spots = await Spot.find().limit(5);
  let createdReports = 0;

  for (const spot of spots) {
    const fakeDeviceHash = hashDeviceId(`device_simulated_${spot._id}`);
    await Report.create({
      spotId: spot._id,
      type: 'ok',
      deviceHash: fakeDeviceHash,
      createdAt: new Date()
    });
    createdReports++;
  }

  await mongoose.disconnect();
}

seedDemoReports().catch((_err) => {
  process.exit(1);
});

