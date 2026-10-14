const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
    },
    vehicleDetails: {
        vehicleType: {
            type: String,
            enum: ["Bike", "Scooter", "Bicycle", "EV", "Other"],
            default: "Bike"
        },
        vehicleNumber: {
            type: String,
            default: ""
        },
        model: {
            type: String,
            default: ""
        }
    },
    licenseNumber: {
        type: String,
        default: ""
    },
    salary: {
        type: Number,
        default: 0
    },
    commissionPerOrder: {
        type: Number,
        default: 0
    },
    assignedCity: {
        type: String,
        default: ""
    },
    assignedAreas: [{
        type: String
    }],
    assignedPincodes: [{
        type: String
    }],
    isOnline: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["active", "suspended", "inactive"],
        default: "active"
    },
    rating: {
        average: { type: Number, default: 5.0 },
        count: { type: Number, default: 0 }
    },
    currentLocation: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
    },
    pendingOrdersCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("deliveryMan", deliveryManSchema);