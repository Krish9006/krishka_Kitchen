/**
 * AUTH MIDDLEWARE (User ke liye)
 * Ye middleware check karta hai ki user logged in hai ya nahi
 * Protected routes pe use hota hai (jaise Get All Food)
 */
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist.model");
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * AUTH MIDDLEWARE FUNCTION
 * Ye function har protected route ke pehle run hota hai
 * Agar user valid hai toh next() call hota hai (controller run hota hai)
 * Agar invalid hai toh 401 Unauthorized error milta hai
 */
async function authMiddleware(req, res, next) {
    try {
        // Step 1: Cookie ya Header se token nikalo
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        // Step 2: Agar token nahi hai = user logged in nahi hai
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Step 3: Check karo token blacklisted toh nahi (logout ke baad)
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token expired. Please login again" });
        }

        // Step 4: Token verify karo (valid hai ya tampered hai)
        const decoded = jwt.verify(token, JWT_SECRET);

        // Step 5: User ID ko request mein attach karo (baad mein use ke liye)
        req.userId = decoded.id;

        // Step 6: Sab sahi hai, aage badho (controller run karo)
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;
