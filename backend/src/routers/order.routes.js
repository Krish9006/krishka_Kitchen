const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Food = require('../models/food.model');
const authmiddleware = require('../middlewares/auth.middleware');
const authfoodpartnermiddleware = require('../middlewares/authfoodpartner');

// POST /api/order - Place a new order (Split by Partner)
router.post('/', authmiddleware, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.userId; // From authmiddleware

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain items" });
        }

        // 1. Group items by Partner ID
        const partnerGroups = {};

        // We need to fetch the actual Food item to know the Partner ID
        // This also validates that the food exists and prevents price tampering (optional improvement)
        for (const item of items) {
            const foodItem = await Food.findById(item.foodId);
            if (!foodItem) {
                return res.status(404).json({ message: `Food item not found: ${item.name}` });
            }

            const partnerId = foodItem.foodpartner.toString();

            if (!partnerGroups[partnerId]) {
                partnerGroups[partnerId] = {
                    partnerId: partnerId,
                    items: [],
                    subtotal: 0
                };
            }

            partnerGroups[partnerId].items.push({
                foodId: item.foodId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            });
            partnerGroups[partnerId].subtotal += item.price * item.quantity;
        }

        // 2. Create an Order for each Partner
        const createdOrders = [];
        for (const partnerId in partnerGroups) {
            const group = partnerGroups[partnerId];

            const newOrder = new Order({
                user: userId,
                partner: partnerId,
                items: group.items,
                totalAmount: group.subtotal,
                status: 'pending'
            });

            const savedOrder = await newOrder.save();
            createdOrders.push(savedOrder);
        }

        res.status(201).json({
            message: "Orders placed successfully!",
            orders: createdOrders
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
});

// GET /api/order/partner - Get orders for the logged-in partner
router.get('/partner', authfoodpartnermiddleware, async (req, res) => {
    try {
        const partnerId = req.foodpartner._id;

        // Find orders for this partner, sort by newest first
        const orders = await Order.find({ partner: partnerId })
            .populate('user', 'name email') // Get User details
            .populate('items.foodId', 'name video') // Get Food details (optional, if we want visuals)
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Error fetching partner orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

module.exports = router;
