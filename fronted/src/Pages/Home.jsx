import React, { useRef, useEffect, useState } from 'react';
import '../styles/home.css'; // Restoring Premium Styles
import '../styles/CartSheet.css'; // Import Cart Styles
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import CartSheet from '../components/CartSheet';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const containerRef = useRef(null);
    const { cart } = useCart();

    // Fetch Feed Data
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food');
                setFoods(response.data);
            } catch (error) {
                console.error("Error fetching food:", error);
            }
        };
        fetchFood();
    }, []);

    // Scroll Observer to detect which video is active
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        };

        // Debounce scroll event slightly for performance if needed, but direct is fine for now
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex, foods]);

    // Likes State
    const [likedVideos, setLikedVideos] = useState({});
    const toggleLike = (videoId) => {
        setLikedVideos(prev => ({
            ...prev,
            [videoId]: !prev[videoId]
        }));
    };

    if (foods.length === 0) {
        return <div className="loading-container">Loading your food feed... 🍔</div>;
    }

    return (
        <div className="video-feed-container" ref={containerRef}>
            {/* Top Navigation using professional Navbar component */}
            <Navbar onCartClick={() => setIsCartOpen(true)} />

            <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Video Feed */}
            {foods.map((item, index) => (
                <VideoCard
                    key={item._id}
                    item={item}
                    isActive={index === activeIndex}
                    toggleLike={toggleLike}
                    isLiked={!!likedVideos[item._id]}
                />
            ))}
        </div>
    );
};

export default Home;
