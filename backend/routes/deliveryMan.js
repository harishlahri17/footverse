const express = require("express");
const route = express.Router();
const { authMiddleware } = require("../middleware/auth-Middleware");

const { addDeliveryMan, getDeliveryMan, getSingleDeliveryMan, updateDeliveryMan, getDeliveryManPofile } = require("../controller/deliveryManController");
route.post("/add-delivery-man", authMiddleware, addDeliveryMan);
route.get("/getAll-delivery-man", authMiddleware, getDeliveryMan);
route.get("/get-signle-delivery-man/:id", authMiddleware, getSingleDeliveryMan);
route.put("/update-single-delivery-man/:id", authMiddleware, updateDeliveryMan);
route.get("/get-deliveryMan-profile", authMiddleware, getDeliveryManPofile);

module.exports = route;