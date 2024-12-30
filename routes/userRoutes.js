const express = require('express');
const router = express.Router();
const User = require('../models/user');

// get user by userid  /api/user/id
router.get('/:id?', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
