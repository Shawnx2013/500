const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    imageType: {
        type: String,
        require: true
    },
    postedAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    description: {
        type: String
    }
});
photoSchema.virtual('path').get(function(){
    if(this.image != null && this.imageType != null){
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
});

module.exports = mongoose.model('Photo', photoSchema);