import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CommentSheet.css';

const CommentSheet = ({ isOpen, onClose, foodId, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && foodId) {
            fetchComments();
        }
    }, [isOpen, foodId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://krishka-kitchen-2.onrender.com/api/social/comments/${foodId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`https://krishka-kitchen-2.onrender.com/api/social/comment/${foodId}`,
                { text: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([response.data, ...comments]);
            setNewComment('');
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="comment-sheet-overlay" onClick={onClose}>
            <div className="comment-sheet-container" onClick={e => e.stopPropagation()}>
                <div className="comment-sheet-header">
                    <h3>Comments ({comments.length})</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="comments-list">
                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first!</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="comment-item">
                                <div className="comment-avatar">
                                    {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="comment-content">
                                    <span className="comment-author">{comment.user?.name || 'User'}</span>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form className="comment-input-area" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit" disabled={!newComment.trim()}>Post</button>
                </form>
            </div>
        </div>
    );
};

export default CommentSheet;
