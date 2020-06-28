const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },

});

module.exports = mongoose.model('Comment', commentSchema);