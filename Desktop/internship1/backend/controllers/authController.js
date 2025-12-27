const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { email, password, assistantName, assistantImage } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            assistantName,
            assistantImage
        });

        await user.save();

        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                email: user.email,
                assistantName: user.assistantName,
                assistantImage: user.assistantImage
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                email: user.email,
                assistantName: user.assistantName,
                assistantImage: user.assistantImage
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
