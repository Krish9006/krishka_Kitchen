/**
 * AUTH FOOD PARTNER MIDDLEWARE
 * Ye middleware check karta hai ki Food Partner logged in hai ya nahi
 * Sirf Add Food route pe use hota hai
 */

const foodpartnermodel = require("../models/foodpartner");
const jwt = require("jsonwebtoken");

/**
 * AUTH FOOD PARTNER MIDDLEWARE FUNCTION
 * Flow:
 * 1. Cookie se token lo
 * 2. Token verify karo
 * 3. Database se partner data laao
 * 4. req.foodpartner mein attach karo
 * 5. next() call karo
 */
async function authfoodpartnermiddleware(req, res, next) {
    try {
        // Step 1: Cookie ya Header se token nikalo
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        console.log("Auth Debug - Received Cookie:", req.cookies); // DEBUG LOG
        console.log("Auth Debug - Token Present:", !!token); // DEBUG LOG

        // Step 2: Token check karo
        if (!token) {
            console.log("Auth Debug - No Token Found"); // DEBUG LOG
            return res.status(401).json({ message: "Unauthorized: No Token" });
        }

        // Step 3: Token verify karo aur decode karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Auth Debug - Decoded Token:", decoded); // DEBUG LOG

        // EXTRA SECURITY: Check role
        if (decoded.role !== "foodpartner") {
            console.log("Auth Debug - Role Mismatch:", decoded.role); // DEBUG LOG
            return res.status(401).json({ message: "Unauthorized: Not a Food Partner" });
        }

        // Step 4: Database se partner ka data laao
        const foodpartner = await foodpartnermodel.findById(decoded.id);

        if (!foodpartner) {
            console.log("Auth Debug - Partner Not Found in DB"); // DEBUG LOG
            return res.status(401).json({ message: "Unauthorized: Partner not found" });
        }

        // Step 5: Partner data ko request object mein attach karo
        req.foodpartner = foodpartner;

        // Step 6: Next middleware/controller pe jaao
        next();
    } catch (error) {
        console.log("Auth Debug - Exception:", error.message); // DEBUG LOG
        return res.status(401).json({ message: "Unauthorized: Invalid Token or Error" });
    }
}

module.exports = authfoodpartnermiddleware;