const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requesterName: { type: String, required: true },
    requesterType: { type: String, required: true },
    purpose: { type: String, required: true },
    attributesRequested: [String],
    durationDays: Number,
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'DENIED', 'EXPIRED'],
        default: 'PENDING'
    },
    riskScore: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccessRequest', requestSchema);
