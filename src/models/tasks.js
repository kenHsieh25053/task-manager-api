const mongoose = require('mongoose') // Import mongoose module for manipulating mongodb

// Define task schema
const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // Store user's id
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Refer to user collection
    },
}, {
    timestamps: true
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task