/**
 * AUTH CONTROLLER
 * Ye file authentication ke saare functions handle karti hai
 * - User Register, Login, Logout
 * - Food Partner Register, Login
 */

const usermodel = require("../models/user.model");       // User database model
const Blacklist = require("../models/blacklist.model"); // Logout tokens store karne ke liye
const bcryptjs = require("bcryptjs");                   // Password encrypt karne ke liye
const jwt = require("jsonwebtoken");                    // JWT token generate karne ke liye
const foodpartnermodel = require("../models/foodpartner"); // Food Partner model

const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT (from .env file)

// ==================== USER AUTH ====================

/**
 * REGISTER CONTROLLER
 * Naya user register karta hai
 * Input: { name, email, password }
 * Output: User data + JWT token in cookie
 */
async function registerController(req, res) {
    try {
        // Step 1: Request body se data nikalo
        const { name, email, password } = req.body;

        // Step 2: Check karo saare fields bhare hain ya nahi
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Step 3: Check karo user pehle se exist toh nahi karta
        const userAlreadyExists = await usermodel.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Step 4: Password ko hash (encrypt) karo - security ke liye
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Step 5: Database mein naya user create karo
        const user = await usermodel.create({ name, email, password: hashedPassword });

        // Step 6: JWT token generate karo (7 din ke liye valid)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        // Step 7: Token ko cookie mein store karo (httpOnly = JavaScript se access nahi ho sakta)
        console.log("DEBUG: Register Controller Hit");
        console.log("DEBUG: Token generated:", token);
        res.cookie("token", token, { httpOnly: true });

        // Step 8: Success response bhejo
        res.status(201).json({
            message: "User registered successfully",
            token: token, // Send token for client-side storage
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/**
 * LOGIN CONTROLLER
 * Existing user login karta hai
 * Input: { email, password }
 * Output: User data + JWT token in cookie
 */
async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        // Validation: Email aur password required hai
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Database mein user dhoondo
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Password match karo (hashed password se compare)
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Token generate karo aur cookie mein daalo
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
            message: "Login successful",
            token: token, // Send token for client-side storage
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/**
 * LOGOUT CONTROLLER
 * User logout karta hai
 * Token ko blacklist mein daalte hain taaki dubara use na ho sake
 */
async function logoutController(req, res) {
    try {
        const token = req.cookies.token;

        // Agar token hai toh usse blacklist mein daalo
        if (token) {
            const decoded = jwt.decode(token);           // Token decode karo
            const expiresAt = new Date(decoded.exp * 1000); // Expiry time nikalo
            await Blacklist.create({ token, expiresAt }); // Blacklist mein save karo
        }

        // Cookie clear karo
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==================== FOOD PARTNER AUTH ====================

/**
 * REGISTER FOOD PARTNER
 * Restaurant/Food Partner register karta hai
 * Same as user register, but different model
 */
async function registerfoodpartner(req, res) {
    try {
        const { name, email, password, contact, address, city, state, pincode } = req.body;

        if (!name || !email || !password || !contact || !address || !city || !state || !pincode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if partner already exists
        const partnerAlreadyExists = await foodpartnermodel.findOne({ email });
        if (partnerAlreadyExists) {
            return res.status(400).json({ message: "Partner already exists" });
        }

        // Hash password and create partner
        const hashedPassword = await bcryptjs.hash(password, 10);
        const partner = await foodpartnermodel.create({
            name,
            email,
            password: hashedPassword,
            contact,
            address,
            city,
            state,
            pincode
        });

        // Token mein role bhi add karo (foodpartner)
        const token = jwt.sign({ id: partner._id, role: "foodpartner" }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({
            message: "Food Partner registered successfully",
            partner: {
                _id: partner._id,
                email: partner.email,
                name: partner.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

/**
 * LOGIN FOOD PARTNER
 * Restaurant/Food Partner login karta hai
 */
async function loginfoodpartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const partner = await foodpartnermodel.findOne({ email });
        if (!partner) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, partner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: partner._id, role: "foodpartner" }, JWT_SECRET, { expiresIn: "7d" });

        // EXPLICIT COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Localhost pe false rakho
            sameSite: "Lax",
            path: "/" // Ensure cookie is available for all routes
        });

        res.status(200).json({
            message: "Login successful",
            partner: {
                _id: partner._id,
                email: partner.email,
                name: partner.name,
                contact: partner.contact,
                address: partner.address,
                city: partner.city,
                state: partner.state,
                pincode: partner.pincode,
                role: "foodpartner"
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Saare functions export karo
module.exports = {
    registerController,
    loginController,
    logoutController,
    registerfoodpartner,
    loginfoodpartner,
    getPartnerProfile
};

/**
 * GET PARTNER PROFILE
 * Logged in partner ka data fetch karta hai
 */
async function getPartnerProfile(req, res) {
    try {
        // req.foodpartner auth middleware se aata hai
        const partner = req.foodpartner;

        res.status(200).json({
            partner: {
                _id: partner._id,
                email: partner.email,
                name: partner.name,
                contact: partner.contact,
                address: partner.address,
                city: partner.city,
                state: partner.state,
                pincode: partner.pincode,
                role: "foodpartner"
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}