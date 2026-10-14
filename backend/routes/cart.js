const express = require("express");
const route = express.Router();
const { authMiddleware } = require("../middleware/auth-Middleware");

const {addToCart, getCart, removeCart, increaseCart, decreaseCart} =require("../controller/cartController");
route.post("/add-cart", authMiddleware, addToCart);
route.get("/get-cart", authMiddleware, getCart);
route.delete("/remove-cart", authMiddleware, removeCart);
route.put("/increase-cart", authMiddleware, increaseCart);
route.put("/decrease-cart", authMiddleware, decreaseCart);


module.exports = route;