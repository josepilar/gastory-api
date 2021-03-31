const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    trip: { type: Number, required: true },
    cost: { type: Number, required: true },
    volume: { type: Number, required: true },
    carId: { type: String, required: true },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('trip', tripSchema);