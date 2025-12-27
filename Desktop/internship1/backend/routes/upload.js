const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const auth = require('../middleware/auth');

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Upload to Cloudinary using stream
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'jarvis_assistants' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
