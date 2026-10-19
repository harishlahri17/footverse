const mongoose = require("mongoose");
const Order = require("../model/ordersModel");
const Cart = require("../model/cartModel");
const DeliveryManModel = require("../model/deliveryManModel");
const Notification = require("../model/notificationModel");
const Earning = require("../model/earningModel");

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, email, items, address, subtotal, shipping, discount, total, paymentMode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ Success: false, Message: "No items in order" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create order
        const newOrder = new Order({
            userId,
            fullName,
            phone,
            email,
            items,
            address,
            subtotal,
            shipping,
            discount,
            total,
            paymentMode,
            paymentStatus: paymentMode === "COD" ? "Pending" : "Paid",
            orderStatus: "placed",
            otp,
            trackingHistory: [
                {
                    status: "placed",
                    location: "Warehouse Raipur"
                }
            ]
        });
        await newOrder.save();

        // Clear user's cart
        await Cart.deleteMany({ userId });

        res.status(201).json({ Success: true, Message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Get all orders (Admin only)
const adminGetAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "fullName email phone")
            .populate("items.productId")
            .populate("deliveryPartnerId", "fullName email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({ Success: true, orders });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        let location = "Warehouse Raipur";
        if (status === "shipped") {
            location = "Raipur Hub";
        } else if (status === "out_for_delivery") {
            location = "Tikrapara";
        } else if (status === "delivered" || status === "cancelled") {
            location = "Customer Address";
        }

        order.orderStatus = status;
        order.trackingHistory.push({
            status,
            location
        });

        if (status === "delivered") {
            order.paymentStatus = "Paid";
        }

        await order.save();
        res.status(200).json({ Success: true, Message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// logged in user , my order
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.status(200).json({ Success: true, orders });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Get specific order details/tracking
const getTracking = async (req, res) => {
    try {
        const orderId = req.params.id || req.params.orderId;
        const order = await Order.findById(orderId)
            .populate("items.productId")
        // .populate("deliveryPartnerId", "fullName email phone");

        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        res.status(200).json({ Success: true, order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};


// Fetch delivery partner list (Admin only)
const getDeliveryPartners = async (req, res) => {
    try {
        const partners = await DeliveryManModel.find({ status: "active" }).populate("userId", "fullName email phone role");
        return res.status(200).json({
            Success: true,
            Message: " Delivery Man fetched successfullly !",
            partners: partners,
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        })
    }
}

// Assign delivery partner manually (Admin only)
const adminAssignDelivery = async (req, res) => {
    try {
        const { orderId, deliveryManProfileId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        const deliveryMan = await DeliveryManModel.findById(deliveryManProfileId).populate("userId", "fullName email phone");
        if (!deliveryMan) {
            return res.status(404).json({ Success: false, Message: "Delivery boy profile not found" });
        }

        // Decrement old delivery boy's count if reassigning
        if (order.deliveryManProfileId && order.deliveryManProfileId.toString() !== deliveryManProfileId) {
            await DeliveryManModel.findByIdAndUpdate(order.deliveryManProfileId, { $inc: { pendingOrdersCount: -1 } });
        }

        order.deliveryManProfileId = deliveryMan._id;
        order.deliveryPartnerId = deliveryMan.userId._id;
        order.orderStatus = "assigned";
        order.assignmentType = "manual";

        order.trackingHistory.push({
            status: "assigned",
            location: `Assigned to ${deliveryMan.userId.fullName} (Manual)`
        });

        await order.save();

        // Increment new delivery boy's counter
        deliveryMan.pendingOrdersCount = (deliveryMan.pendingOrdersCount || 0) + 1;
        await deliveryMan.save();

        // Save Notification
        await Notification.create({
            recipientId: deliveryMan.userId._id,
            recipientRole: "delivery",
            title: "New Assignment",
            message: `Order #${order._id.toString().substring(order._id.toString().length - 8).toUpperCase()} has been manually assigned to you.`,
            type: "order_assigned",
            orderId: order._id
        });

        // Broadcast to Delivery Man
        const io = req.app.get("io");
        if (io) {
            io.to(`delivery_${deliveryMan.userId._id.toString()}`).emit("new_order_assignment", {
                orderId: order._id,
                message: "New delivery assignment received."
            });
        }

        res.status(200).json({ Success: true, Message: "Delivery partner assigned successfully", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};


// Get assigned orders for logged-in delivery partner
const deliveryGetAssignedOrders = async (req, res) => {
    try {
        const partnerId = req.user.id;
        const orders = await Order.find({ deliveryPartnerId: partnerId })
            .populate("userId", "fullName email phone")
            .populate("items.productId")
            .sort({ updatedAt: -1 });

        res.status(200).json({ Success: true, orders });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// delivery man Accept assigned order
const deliveryAcceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        order.orderStatus = "confirmed";
        order.trackingHistory.push({
            status: "confirmed",
            location: "Accepted by delivery partner at Warehouse Raipur"
        });
        await order.save();

        // Emit Socket event to customer
        const io = req.app.get("io");
        if (io) {
            io.to(`order_${order._id.toString()}`).emit("order_status_update", {
                orderId: order._id,
                status: "confirmed",
                location: "Accepted by delivery partner at Warehouse Raipur"
            });
        }

        res.status(200).json({ Success: true, Message: "Order accepted successfully", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Start delivery (Out for delivery)
const deliveryStartDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        order.orderStatus = "out_for_delivery";
        order.trackingHistory.push({
            status: "out_for_delivery",
            location: "Out for delivery from Tikrapara Hub"
        });
        await order.save();

        // Emit Socket event to customer
        const io = req.app.get("io");
        if (io) {
            io.to(`order_${order._id.toString()}`).emit("order_status_update", {
                orderId: order._id,
                status: "out_for_delivery",
                location: "Out for delivery from Tikrapara Hub"
            });
        }

        res.status(200).json({ Success: true, Message: "Delivery started successfully", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Reached Customer Location
const deliveryReachedLocation = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        order.orderStatus = "reached_customer";
        order.trackingHistory.push({
            status: "reached_customer",
            location: "Delivery agent reached customer location"
        });
        await order.save();

        // Emit Socket event to customer
        const io = req.app.get("io");
        if (io) {
            io.to(`order_${order._id.toString()}`).emit("order_status_update", {
                orderId: order._id,
                status: "reached_customer",
                location: "Delivery agent reached customer location"
            });
        }

        res.status(200).json({ Success: true, Message: "Reached customer location status recorded", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

// Mark delivered with OTP validation & Earning logs
const deliveredVerifyOTP = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ Success: false, Message: "Order not found" });
        }

        if (order.otp !== otp) {
            return res.status(400).json({ Success: false, Message: "Invalid OTP delivery verification code" });
        }

        order.orderStatus = "delivered";
        order.otpVerified = true;
        order.paymentStatus = "Paid";
        order.trackingHistory.push({
            status: "delivered",
            location: "Delivered to Customer Address"
        });

        await order.save();

        // Update Delivery Man Profile counters
        if (order.deliveryManProfileId) {
            const dboy = await DeliveryManModel.findById(order.deliveryManProfileId);
            if (dboy) {
                dboy.pendingOrdersCount = Math.max(0, (dboy.pendingOrdersCount || 1) - 1);
                dboy.isAvailable = true;
                await dboy.save();

                // Record Earnings Log
                const today = new Date().toISOString().split("T")[0];
                await Earning.create({
                    deliveryBoyId: dboy._id,
                    orderId: order._id,
                    codAmountCollected: order.paymentMode === "COD" ? order.total : 0,
                    commissionEarned: dboy.commissionPerOrder || 0,
                    date: today
                });
            }
        }

        // Notify customer and admin via Socket
        const io = req.app.get("io");
        if (io) {
            io.to(`order_${order._id.toString()}`).emit("order_status_update", {
                orderId: order._id,
                status: "delivered",
                location: "Delivered to Customer Address"
            });
            io.to("admin_room").emit("admin_order_notification", {
                orderId: order._id,
                message: `Order #${order._id.toString().substring(order._id.toString().length - 8).toUpperCase()} delivered successfully.`
            });
        }

        res.status(200).json({ Success: true, Message: "Order delivered successfully!", order });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

module.exports = {
    placeOrder, adminGetAllOrders, updateOrderStatus, getMyOrders, getTracking,
    getDeliveryPartners, adminAssignDelivery, deliveryGetAssignedOrders, deliveryAcceptOrder,
    deliveryStartDelivery, deliveryReachedLocation, deliveredVerifyOTP
};