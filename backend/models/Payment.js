const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        default: null
    },
    signature: {
        type: String,
        default: null
    },
    amount: {
        type: Number, // in Rupees (e.g. 499)
        required: true
    },
    amountInPaise: {
        type: Number, // amount * 100
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'captured', 'failed', 'refunded'],
        default: 'created'
    },
    itemType: {
        type: String,
        enum: ['course', 'subscription', 'assessment', 'other'],
        default: 'course'
    },
    itemId: {
        type: String,
        default: null
    },
    itemName: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    notes: {
        type: Map,
        of: String,
        default: {}
    },
    failureReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
