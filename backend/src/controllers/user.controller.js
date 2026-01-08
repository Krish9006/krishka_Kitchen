const User = require('../models/user.model');

module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updates = req.body;

        // Prevent password update via this route for security, use distinct route if needed
        delete updates.password;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error("Update Profile Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
