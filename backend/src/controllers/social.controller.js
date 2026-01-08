const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const Food = require('../models/food.model');

module.exports.toggleLike = async (req, res) => {
    try {
        const { foodId } = req.params;
        const userId = req.userId;

        const existingLike = await Like.findOne({ user: userId, food: foodId });

        if (existingLike) {
            // Unlike
            await Like.findByIdAndDelete(existingLike._id);
            await Food.findByIdAndUpdate(foodId, { $inc: { likesCount: -1 } });
            return res.status(200).json({ message: 'Unliked', isLiked: false });
        } else {
            // Like
            await Like.create({ user: userId, food: foodId });
            await Food.findByIdAndUpdate(foodId, { $inc: { likesCount: 1 } });
            return res.status(200).json({ message: 'Liked', isLiked: true });
        }
    } catch (error) {
        console.error("Like Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const { foodId } = req.params;
        const { text } = req.body;
        const userId = req.userId;

        const comment = await Comment.create({ user: userId, food: foodId, text });
        await Food.findByIdAndUpdate(foodId, { $inc: { commentsCount: 1 } });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'name');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Add Comment Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.getComments = async (req, res) => {
    try {
        const { foodId } = req.params;
        const comments = await Comment.find({ food: foodId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Get Comments Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.shareFood = async (req, res) => {
    try {
        const { foodId } = req.params;
        await Food.findByIdAndUpdate(foodId, { $inc: { sharesCount: 1 } });
        res.status(200).json({ message: 'Share counted' });
    } catch (error) {
        console.error("Share Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.getSocialStatus = async (req, res) => {
    try {
        const { foodId } = req.params;
        const userId = req.userId;

        const isLiked = await Like.exists({ user: userId, food: foodId });
        // We can also return counts here if we want fresh data
        const food = await Food.findById(foodId).select('likesCount commentsCount sharesCount');

        res.status(200).json({
            isLiked: !!isLiked,
            likesCount: food.likesCount,
            commentsCount: food.commentsCount,
            sharesCount: food.sharesCount
        });
    } catch (error) {
        console.error("Get Social Status Error", error);
        res.status(500).json({ message: 'Server Error' });
    }
}
