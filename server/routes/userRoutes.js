import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

/**
 * GET /api/users/current
 * Returns or seeds a campus-verified user for testing
 */
router.get('/current', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'alex.rivera@campus.edu' });
    if (!user) {
      user = await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@campus.edu',
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user profile', error: error.message });
  }
});

export default router;
