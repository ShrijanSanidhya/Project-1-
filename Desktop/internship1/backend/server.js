const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load Config
dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// DB Config
const connectDB = require('./config/db');
connectDB();

// Routes (Placeholders for now)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/upload', require('./routes/upload'));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
