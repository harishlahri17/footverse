const mongoose = require("mongoose");

const userDetails = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
        phone:{
        type:String,
        default:""
    },

    state:{
        type:String,
        default:""
    },

    district:{
        type:String,
        default:""
    },

    city:{
        type:String,
        default:""
    },

    postOffice:{
        type:String,
        default:""
    },

    area:{
        type:String,
        default:""
    },

    pinCode:{
        type:String,
        default:""
    },
    dob: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: "Male"
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    addresses: [
        {
            type: { type: String, default: "Home" },
            line1: { type: String, default: "" },
            line2: { type: String, default: "" },
            phone: { type: String, default: "" },
            isDefault: { type: Boolean, default: false }
        }
    ],
    role: {
        type: String,
        enum: ["user", "admin","delivery"],
        default: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model("users", userDetails);