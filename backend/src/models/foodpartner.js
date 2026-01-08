/**
 * FOOD PARTNER MODEL
 * Database schema for Food Partners (Restaurants)
 * MongoDB collection: "foodpartners"
 */

const mongoose = require("mongoose");

const foodpartnerSchema = new mongoose.Schema({
    // Restaurant Details
    name: { type: String, required: true },
    contact: { type: String, required: true }, // Phone number

    // Address Details
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    // Auth Details
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

// Model name "FoodPartner" = same as ref in food.model.js
const foodpartnermodel = mongoose.model("FoodPartner", foodpartnerSchema);
module.exports = foodpartnermodel;