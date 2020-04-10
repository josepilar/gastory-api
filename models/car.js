const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    userId: { type: String },
    maker: { type: String },
    model: { type: String },
    year: { type: Number },
    color: { type: String },
    plates: { type: String },
    dateAdded: { type: Date, default: Date.now },
    imageUrl: { type: String },
    default: { type: Boolean, default: false }
});

module.exports = mongoose.model('car', carSchema);