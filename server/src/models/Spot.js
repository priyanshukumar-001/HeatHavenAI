import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}, { _id: false });

const SpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['water', 'shade', 'rest'],
    required: true
  },
  location: {
    type: PointSchema,
    required: true
  },
  source: {
    type: String,
    enum: ['osm', 'manual', 'crowd'],
    default: 'manual'
  },
  lastVerifiedAt: {
    type: Date,
    default: Date.now
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  status: {
    type: String,
    enum: ['verified', 'check', 'likely_closed', 'unverified'],
    default: 'check'
  },
  reportCounts: {
    ok: { type: Number, default: 0 },
    dry: { type: Number, default: 0 },
    closed: { type: Number, default: 0 }
  },
  aiVerified: {
    type: Boolean,
    default: false
  },
  photoUrl: {
    type: String,
    default: ''
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Geospatial 2dsphere index for $nearSphere queries
SpotSchema.index({ location: '2dsphere' });

export const Spot = mongoose.models.Spot || mongoose.model('Spot', SpotSchema);
export default Spot;

