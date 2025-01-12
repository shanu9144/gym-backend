const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true,
    versionKey: false // Disable the version key
});

// Remove all indexes and create only the necessary ones
taskSchema.pre('save', async function(next) {
    try {
        if (this.collection) {
            await this.collection.dropIndexes();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Create a compound index for userId and title
taskSchema.index({ userId: 1, title: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
