import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import CommentSheet from './CommentSheet';

const VideoCard = ({ item, isActive }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Social State
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(item.likesCount || 0);
    const [commentsCount, setCommentsCount] = useState(item.commentsCount || 0);
    const [sharesCount, setSharesCount] = useState(item.sharesCount || 0);
    const [showComments, setShowComments] = useState(false);

    // Auto-play/pause based on active state
    useEffect(() => {
        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(error => console.log("Auto-play prevented:", error));
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    // Fetch initial social status
    useEffect(() => {
        const fetchSocialStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get(`http://localhost:3000/api/social/status/${item._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Only update if server returns valid data, else fallback to props
                    if (res.data) {
                        setIsLiked(res.data.isLiked);
                        setLikesCount(res.data.likesCount);
                        setCommentsCount(res.data.commentsCount);
                        setSharesCount(res.data.sharesCount);
                    }
                }
            } catch (err) {
                console.error("Error fetching social stats", err);
            }
        };
        fetchSocialStatus();
    }, [item._id]);

    const handleVideoClick = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleOrderClick = (e) => {
        e.stopPropagation();
        addToCart(item);
        alert(`Added ${item.name} to Cart! 🛒`);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) return alert("Please login to like");

        // Optimistic UI Update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            await axios.post(`http://localhost:3000/api/social/like/${item._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Like failed", err);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1);
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');

        // Update UI
        setSharesCount(prev => prev + 1);

        // API Call
        try {
            if (token) {
                await axios.post(`http://localhost:3000/api/social/share/${item._id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error("Share logging failed", err);
        }

        // Native Share or Clipboard
        if (navigator.share) {
            navigator.share({
                title: item.name,
                text: `Check out this delicious ${item.name} on Zomato Clone!`,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="video-card">
            <video
                className="video-player"
                src={item.video}
                ref={videoRef}
                loop
                muted={false}
                playsInline
                onClick={handleVideoClick}
            />

            <div className="actions-sidebar">
                <button className="action-btn" onClick={handleLike}>
                    <div className="icon-container" style={{
                        background: isLiked ? 'rgba(239, 79, 95, 0.2)' : 'rgba(0,0,0,0.4)',
                        borderColor: isLiked ? '#ef4f5f' : 'rgba(255,255,255,0.2)',
                        transform: isLiked ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>{isLiked ? '❤️' : '🤍'}</span>
                    </div>
                    <span className="action-label">{likesCount}</span>
                </button>

                <button className="action-btn" onClick={(e) => { e.stopPropagation(); setShowComments(true); }}>
                    <div className="icon-container">
                        <span style={{ fontSize: '1.5rem' }}>💬</span>
                    </div>
                    <span className="action-label">{commentsCount}</span>
                </button>

                <button className="action-btn" onClick={handleShare}>
                    <div className="icon-container">
                        <span style={{ fontSize: '1.5rem' }}>📤</span>
                    </div>
                    <span className="action-label">{sharesCount}</span>
                </button>
            </div>

            <div className="video-overlay">
                <div className="content-wrapper">
                    {item.foodpartner && (
                        <div
                            className="partner-badge"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/restaurant/${item.foodpartner._id}`);
                            }}
                        >
                            <span>👨‍🍳</span> {item.foodpartner.name}
                        </div>
                    )}

                    <h2 className="dish-name">{item.name}</h2>
                    <p className="dish-description">{item.description}</p>

                    <button className="visit-store-btn" onClick={handleOrderClick}>
                        Order Now 🛵
                    </button>
                </div>
            </div>

            <CommentSheet
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                foodId={item._id}
                onCommentAdded={() => setCommentsCount(prev => prev + 1)}
            />
        </div>
    );
};

export default VideoCard;
