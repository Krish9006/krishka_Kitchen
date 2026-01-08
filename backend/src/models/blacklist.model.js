/**
 * BLACKLIST MODEL
 * Logout ke baad tokens store karta hai
 * Jab user logout karta hai, uska token yahan save hota hai
 * Taaki woh token dubara use na ho sake (security ke liye)
 * 
 * MongoDB collection: "blacklists"
 */

const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    // JWT Token jo logout ke baad invalid ho gaya
    token: { type: String, required: true },

    // Token kab expire hoga
    // index: { expires: 0 } = Automatically delete when expiresAt time passes
    // Ye MongoDB TTL (Time To Live) feature hai
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

/**
 * Kaise kaam karta hai:
 * 1. User logout karta hai
 * 2. Uska token Blacklist mein save hota hai
 * 3. Jab user dubara request karta hai with same token
 * 4. auth.middleware check karta hai - token blacklisted hai ya nahi
 * 5. Agar blacklisted hai = 401 Unauthorized
 * 6. Token expire hone ke baad MongoDB automatically delete kar deta hai
 */

module.exports = mongoose.model("Blacklist", blacklistSchema);
