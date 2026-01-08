const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FoodPartner = require('./src/models/foodpartner.model');
const Food = require('./src/models/food.model');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/zomato-clone')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

async function seed() {
    try {
        // 1. Create Partner
        const email = `testpartner${Date.now()}@test.com`;
        const password = await bcrypt.hash('password123', 10);

        const partner = new FoodPartner({
            name: "Test Partner Pizza",
            email: email,
            password: password,
            contact: "9999999999",
            address: "123 Test St",
            city: "Test City",
            state: "TS",
            pincode: "123456",
            role: "foodpartner"
        });

        await partner.save();
        console.log(`Partner Created: ${email} / password123`);

        // 2. Create Food
        const food = new Food({
            name: "Test Pepperoni Pizza",
            video: "https://example.com/video.mp4", // Dummy
            description: "Delicious test pizza",
            foodpartner: partner._id,
            price: 500 // Adding price explicitly if model supports it, otherwise default
        });

        await food.save();
        console.log(`Food Created: ${food.name}`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
