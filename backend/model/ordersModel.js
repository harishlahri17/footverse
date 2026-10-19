const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            color: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            size: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    address: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true },
        postOffice: { type: String, required: true },
        area: { type: String, required: true },
        pinCode: { type: String, required: true }
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true,
        enum: ["COD", "UPI", "Card"]
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "placed", 
            "confirmed", 
            "packed", 
            "assigned",
            "shipped", 
            "picked_up",
            "out_for_delivery", 
            "reached_customer",
            "delivered", 
            "cancelled",
            "returned"
        ],
        default: "placed"
    },
    deliveryPartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    deliveryManProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deliveryMan",
        default: null
    },
    assignmentType: {
        type: String,
        enum: ["manual", "automatic", "unassigned"],
        default: "unassigned"
    },
    otp: {
        type: String,
        required: true
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    trackingHistory: [
        {
            status: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema);
