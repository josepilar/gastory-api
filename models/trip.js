const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: { type: String },
    date: { type: Date, default: Date.now },
    trip: { type: Number },
    cost: { type: Number },
    volume: { type: Number },
    carId: { type: String }
});

module.exports = mongoose.model('trip', tripSchema);