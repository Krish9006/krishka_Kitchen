const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    video: { type: String, required: true }, // URL from ImageKit
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true, default: 'Other' },
    foodpartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodPartner',
        required: true
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('food', foodSchema);