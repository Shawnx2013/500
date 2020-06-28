const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Blog', blogSchema);