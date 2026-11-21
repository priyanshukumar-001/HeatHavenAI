import { z } from 'zod';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export const authBodySchema = z.object({
  name: z.string().min(2).max(50),
  phoneOrEmail: z.string().min(3).max(100),
  role: z.enum(['delivery_rider', 'street_vendor', 'construction_worker', 'commuter', 'community_volunteer']).optional()
});

/**
 * Register or login user (passwordless quick onboarding for workers)
 */
export async function handleLoginOrRegister(req, res, next) {
  try {
    const { name, phoneOrEmail, role = 'delivery_rider' } = req.body;
    const cleanId = phoneOrEmail.trim().toLowerCase();

    if (isDbConnected()) {
      let user = await User.findOne({ phoneOrEmail: cleanId });

      if (!user) {
        user = await User.create({
          name: name.trim(),
          phoneOrEmail: cleanId,
          role,
          contributionsCount: 1,
          savedSpots: []
        });
      } else {
        user.name = name.trim();
        if (role) user.role = role;
        await user.save();
      }

      return res.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          phoneOrEmail: user.phoneOrEmail,
          role: user.role,
          contributionsCount: user.contributionsCount,
          savedSpots: user.savedSpots,
          badge: user.contributionsCount >= 10 ? 'Relief Sentinel' : user.contributionsCount >= 5 ? 'Hydration Guardian' : 'Relief Scout'
        }
      });
    }

    // In-memory fallback if MongoDB is in offline mode
    const fallbackId = `user_${Date.now()}`;
    return res.json({
      user: {
        id: fallbackId,
        name: name.trim(),
        phoneOrEmail: cleanId,
        role,
        contributionsCount: 2,
        savedSpots: [],
        badge: 'Relief Scout'
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Increment user contribution counter
 */
export async function handleAddContribution(req, res, next) {
  try {
    const { userId } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (user) {
        user.contributionsCount += 1;
        await user.save();
        return res.json({ success: true, contributionsCount: user.contributionsCount });
      }
    }

    return res.json({ success: true, contributionsCount: 1 });
  } catch (err) {
    next(err);
  }
}

