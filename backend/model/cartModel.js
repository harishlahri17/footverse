const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
{
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    qty:{
        type:Number,
        default:1
    }
},
{timestamps:true});

module.exports = mongoose.model("cart", cartSchema);