const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Use req.user.id from the authenticated token
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { handicap, clubs } = req.body;
    console.log('Updating profile:', { handicap, clubs }); // Debug log

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the fields
    user.handicap = handicap;
    user.clubs = clubs;

    await user.save();
    console.log('Profile updated successfully'); // Debug log

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;