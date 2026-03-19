import React, { useRef, useEffect, useState } from 'react';
import '../styles/home.css'; // Restoring Premium Styles
import '../styles/CartSheet.css'; // Import Cart Styles
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';
import VideoSkeleton from '../components/VideoSkeleton';
import CartSheet from '../components/CartSheet';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const containerRef = useRef(null);
    const { cart } = useCart();

    // Fetch Feed Data
    useEffect(() => {
        let timeoutId;
        const fetchFood = async () => {
            timeoutId = setTimeout(() => {
                toast("Waking up server... This might take up to 40s on a free tier! 🚀", {
                    icon: '⏳',
                    duration: 6000,
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            }, 3000);

            try {
                const response = await axios.get('https://krishka-kitchen-2.onrender.com/api/food');
                clearTimeout(timeoutId);
                setFoods(response.data);
            } catch (error) {
                console.error("Error fetching food:", error);
                clearTimeout(timeoutId);
                toast.error("Failed to load feed. Is the backend down?", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
            }
        };
        fetchFood();
        return () => clearTimeout(timeoutId);
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
        return (
            <div className="video-feed-container">
                <Navbar onCartClick={() => setIsCartOpen(true)} />
                <VideoSkeleton />
            </div>
        );
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
