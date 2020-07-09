const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    completed: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('ListItem', listItemSchema);