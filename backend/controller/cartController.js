const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size } = req.body;
        const existing = await Cart.findOne({
            userId,
            productId,
            size
        });
        if (existing) {
            existing.qty += 1;
            await existing.save();
            return res.status(200).json({ Success: true });
        }

        await Cart.create({
            userId,
            productId,
            size,
            qty: 1
        });
        res.status(200).json({ Success: true });

    }
    catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.find({ userId }).populate("productId");
        res.status(200).json({ Success: true, cart });
    }
    catch (error) {
        res.status(500).json({
            Success: false,
            Message: error.message
        });
    }

}

const removeCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size } = req.body;
        await Cart.findOneAndDelete({
            userId,
            productId,
            size
        });
        res.status(200).json({ Success: true, Message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
};

const increaseCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size } = req.body;
        const existing = await Cart.findOne({
            userId,
            productId,
            size
        });
        if (existing) {
            existing.qty += 1;
            await existing.save();
            return res.status(200).json({ Success: true, Message: "Quantity increased" });
        }
        res.status(404).json({ Success: false, Message: "Cart item not found" });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

const decreaseCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size } = req.body;
        const existing = await Cart.findOne({
            userId,
            productId,
            size
        });
        if (existing) {
            if (existing.qty > 1) {
                existing.qty -= 1;
                await existing.save();
            }
            return res.status(200).json({ Success: true, Message: "Quantity decreased" });
        }
        res.status(404).json({ Success: false, Message: "Cart item not found" });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

module.exports = { addToCart, getCart, removeCart, increaseCart, decreaseCart };