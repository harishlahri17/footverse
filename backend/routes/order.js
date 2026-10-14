const express = require("express");
const route = express.Router();
const { authMiddleware } = require("../middleware/auth-Middleware");

const { placeOrder, adminGetAllOrders, updateOrderStatus, getMyOrders, getTracking, getDeliveryPartners, 
    adminAssignDelivery, deliveryGetAssignedOrders, 
    deliveryAcceptOrder,
    deliveryStartDelivery,
    deliveryReachedLocation,
    deliveredVerifyOTP} = require("../controller/orderController");

route.post("/order-place", authMiddleware, placeOrder); 

route.get("/my-orders", authMiddleware, getMyOrders); //logged in user order
route.get("/track-order/:id", authMiddleware, getTracking); //track my order 

route.get("/get-all-order", authMiddleware, adminGetAllOrders); // get all order by admin
route.put("/order-status", authMiddleware, updateOrderStatus); // update order status
route.get("/fetch-deliveryMan-inOrder", authMiddleware, getDeliveryPartners); //fetch all delivery partner in assing modal
route.put("/order-assign/manually", authMiddleware, adminAssignDelivery); // manually assign order by admin


route.get("/get-assigned-order", authMiddleware, deliveryGetAssignedOrders); //get order by deliveryMan, assign order by admin
route.put("/accept-assigned-order", authMiddleware, deliveryAcceptOrder); // delivery man accept order , assigned by admin
route.put("/start-delivery-order", authMiddleware, deliveryStartDelivery); // start delivery after accept
route.put("/reached-delivery-order", authMiddleware, deliveryReachedLocation); // reached delivery man in order location
route.put("/delivered-verify-otp", authMiddleware, deliveredVerifyOTP); //mark delivered and verify otp



module.exports = route;