const mongoose = require("mongoose");

const earningsSchema = new mongoose.Schema({
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deliveryBoys",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true
    },
    codAmountCollected: {
        type: Number,
        default: 0
    },
    commissionEarned: {
        type: Number,
        default: 0
    },
    bonusAmount: {
        type: Number,
        default: 0
    },
    penaltyAmount: {
        type: Number,
        default: 0
    },
    penaltyReason: {
        type: String,
        default: ""
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    isSettled: {
        type: Boolean,
        default: false // Whether admin has reconciled the cash/commission
    }
}, { timestamps: true });

module.exports = mongoose.model("earnings", earningsSchema);
