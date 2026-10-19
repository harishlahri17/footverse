const mongoose = require("mongoose");

const productModel = new mongoose.Schema({

    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    specification: {
        type: [String],
        required: true
    },
    size: {
        type: [Number],
        required: true
    },
    color: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discount: {
        isDiscount: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "", // percentage | amount
        },
        value: {
            type: Number,
            default: 0
        },
        finalPrice: {
            type: Number,
            default: 0
        }
    },
    productImage: [
        {
            url: String,
            tag: String // main | hover | gallery
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("products", productModel);