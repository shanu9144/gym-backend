require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected...');
        // Drop all indexes from the tasks collection
        try {
            const collections = await mongoose.connection.db.collections();
            for (let collection of collections) {
                if (collection.collectionName === 'tasks') {
                    await collection.dropIndexes();
                    console.log('Dropped indexes from tasks collection');
                }
            }
        } catch (error) {
            console.error('Error dropping indexes:', error);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
