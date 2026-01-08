/**
 * USER MODEL
 * Database schema for Users (customers)
 * MongoDB collection: "users"
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // User ka naam
    name: { type: String, required: true },

    // Email - unique hona chahiye (ek email se ek hi account)
    email: { type: String, required: true, unique: true },

    // Password - hashed store hota hai (bcrypt se)
    password: { type: String, required: true },

    // Role - user ya admin (future ke liye admin panel)
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
});

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;
