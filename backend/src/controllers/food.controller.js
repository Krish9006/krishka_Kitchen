/**
 * FOOD CONTROLLER
 * Food items ke saare operations handle karta hai
 * - Add Food (Food Partner only)
 * - Get All Food (Logged in users)
 */

const foodmodel = require("../models/food.model");
const { uploadImage } = require("../services/storage.service"); // ImageKit upload service

/**
 * ADD FOOD
 * Food Partner nayi food item add karta hai with video/image
 * Input: form-data (name, description, video file)
 * Output: Created food item with ImageKit URL
 */
const addFood = async (req, res) => {
    try {
        // Step 1: Check karo video file upload hua hai ya nahi
        // req.file Multer middleware se aata hai
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        // Step 2: File ko ImageKit pe upload karo
        // req.file.buffer = file ka raw data
        // fileName = unique name generate karo timestamp ke saath
        const videoUrl = await uploadImage(
            req.file.buffer,
            `food_${Date.now()}_${req.file.originalname}`
        );

        // Step 3: Database mein food item save karo
        // req.foodpartner authfoodpartnermiddleware se aata hai
        const food = await foodmodel.create({
            name: req.body.name,           // Food name (e.g., "Butter Chicken")
            video: videoUrl,               // ImageKit URL
            description: req.body.description, // Food description
            foodpartner: req.foodpartner._id   // Logged in partner ka ID
        });

        // Step 4: Success response bhejo
        res.status(201).json({ message: "Food added successfully", food });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * GET ALL FOOD
 * Saari food items fetch karta hai
 * populate() = foodpartner ka naam aur email bhi laata hai (instead of just ID)
 */
const getAllfood = async (req, res) => {
    try {
        // Database se saare food items laao
        // populate("foodpartner", "name email") = FoodPartner ka sirf name aur email laao
        const foods = await foodmodel.find().populate("foodpartner", "name email");

        res.status(200).json(foods);
    } catch (error) {
        console.error("Error fetching food:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * GET FOOD BY PARTNER
 * Logged in partner ke khud ke uploaded food items fetch karta hai
 */
const getFoodByPartner = async (req, res) => {
    try {
        // req.foodpartner is set by auth middleware
        const partnerId = req.foodpartner._id;

        const foods = await foodmodel.find({ foodpartner: partnerId });
        res.status(200).json(foods);
    } catch (error) {
        console.error("Error fetching partner foods:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * GET RESTAURANT MENU (PUBLIC)
 * Fetch menu items for a specific partner by ID
 * Publicly accessible for any user to view profile
 */
const getRestaurantMenu = async (req, res) => {
    try {
        const { partnerId } = req.params;

        // Fetch foods
        const foods = await foodmodel.find({ foodpartner: partnerId }).populate("foodpartner", "name email contact address city state pincode");

        // Return structured data
        // If foods found, partner details are in the first item
        // If no foods, we ideally need to fetch partner details separately (requires refactor to fetch Partner model directly)
        // For MVP, we assume active partners have at least 1 food or we send empty list.
        // Better: Let's fetch Partner details even if 0 foods. 
        // But for this sprint, let's stick to returning foods. Front-end can handle empty state or we accept we need at least 1 item to "discover" them via feed.

        res.status(200).json(foods);
    } catch (error) {
        console.error("Error fetching restaurant menu:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export functions
module.exports = { addFood, getAllfood, getFoodByPartner, getRestaurantMenu };
