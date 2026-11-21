import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  spotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spot',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['ok', 'dry', 'closed'],
    required: true
  },
  deviceHash: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for 1 report per spot per device per hour check
ReportSchema.index({ spotId: 1, deviceHash: 1, createdAt: -1 });

export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export default Report;

