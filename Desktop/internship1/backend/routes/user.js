const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        // Exclude password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Customize assistant
// @route   PUT /api/user/customize
// @access  Private
router.put('/customize', auth, async (req, res) => {
    const { assistantName, assistantImage } = req.body;

    try {
        let user = await User.findById(req.user.id);

        if (assistantName) user.assistantName = assistantName;
        if (assistantImage) user.assistantImage = assistantImage;

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
