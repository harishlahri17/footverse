const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;
const databaseConnection = async () => {
    mongoose.connect(mongoURI)
    .then( () => {
        console.log("Databse Connected Successfully !");
    })
    .catch((err) => {
        console.log("Databse Connection Failed !",err);
    });
}
module.exports = databaseConnection;