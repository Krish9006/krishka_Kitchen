/**
 * FOOD ROUTES
 * Food related API endpoints define karta hai
 * 
 * Endpoints:
 * POST /api/food - Add new food (Food Partner only)
 * GET /api/food  - Get all food (User login required)
 */

const express = require("express");
const router = express.Router();

// Controllers - actual logic handle karte hain
const { addFood, getAllfood } = require("../controllers/food.controller");

// Middlewares - security guards jaisa kaam karte hain
const authfoodpartnermiddleware = require("../middlewares/authfoodpartner"); // Food Partner check
const authmiddleware = require("../middlewares/auth.middleware");           // User check

// Multer - file upload handle karta hai
const multer = require("multer");

// Multer config - memory storage matlab file RAM mein store hogi temporarily
const upload = multer({
    storage: multer.memoryStorage()
});

/**
 * POST /api/food
 * Add new food item
 * Flow: Request → authfoodpartnermiddleware → upload.single("video") → addFood
 * 
 * authfoodpartnermiddleware = Check if food partner is logged in
 * upload.single("video") = Accept single file with field name "video"
 * addFood = Save food to database
 */
router.post("/", authfoodpartnermiddleware, upload.single("video"), addFood);

/**
 * GET /api/food
 * Get all food items
 * Flow: Request → authmiddleware → getAllfood
 * 
 * authmiddleware = Check if user is logged in
 * getAllfood = Fetch all food from database
 */
router.get("/", getAllfood);

/**
 * GET /api/food/my-foods
 * Get logged-in partner's food items
 * Flow: Request → authfoodpartnermiddleware → getFoodByPartner
 */
const { getFoodByPartner, getRestaurantMenu } = require("../controllers/food.controller");
router.get("/my-foods", authfoodpartnermiddleware, getFoodByPartner);

/**
 * GET /api/food/restaurant/:partnerId
 * Public route to view specific restaurant's menu
 */
router.get("/restaurant/:partnerId", getRestaurantMenu);

module.exports = router;