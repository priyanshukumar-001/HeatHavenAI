import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    phoneOrEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      enum: ['delivery_rider', 'street_vendor', 'construction_worker', 'commuter', 'community_volunteer'],
      default: 'delivery_rider'
    },
    contributionsCount: {
      type: Number,
      default: 0
    },
    savedSpots: [
      {
        type: String
      }
    ],
    avatarUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

