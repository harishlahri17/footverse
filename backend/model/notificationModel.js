const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    recipientRole: {
        type: String,
        enum: ["admin", "customer", "delivery"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["order_placed", "order_assigned", "order_status", "late_delivery", "system"],
        default: "system"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("notifications", notificationSchema);
