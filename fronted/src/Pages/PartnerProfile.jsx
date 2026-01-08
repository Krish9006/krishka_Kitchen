import React, { useEffect, useState } from 'react';
import '../styles/auth.css'; // Reusing premium auth styles for consistency
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerProfile = () => {
    const [partner, setPartner] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState({ itemsAdded: 0, ordersServed: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                // 1. Fetch Partner Details from Database (via API)
                const profileResponse = await axios.get("http://localhost:3000/api/auth/partner/profile", { withCredentials: true });
                if (profileResponse.status === 200) {
                    setPartner(profileResponse.data.partner);
                }

                // 2. Fetch Menu Items
                const menuResponse = await axios.get("http://localhost:3000/api/food/my-foods", { withCredentials: true });
                if (menuResponse.status === 200) {
                    setMenuItems(menuResponse.data);
                    setStats({
                        itemsAdded: menuResponse.data.length,
                        ordersServed: Math.floor(Math.random() * 50) + 12 // Simulated 'Live' count
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // If 401, redirect to login
                if (error.response && error.response.status === 401) {
                    alert("Session expired. Please login again.");
                    navigate('/partner/login');
                }
            }
        };
        fetchPartnerData();
    }, [navigate]);

    if (!partner) return <div style={{ color: 'white', padding: '50px' }}>Loading Profile...</div>;

    return (
        <div className="start-screen-container" style={{ background: '#000', minHeight: '100vh', paddingBottom: '50px' }}>

            {/* 1. Cover Photo & Profile Header */}
            <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                <img
                    src="https://b.zmtcdn.com/data/pictures/chains/1/50471/61c4708779c1626a570c9fd920395359.jpg"
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }}
                />
                <div style={{ position: 'absolute', bottom: '-40px', left: '5%', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%', background: '#fff',
                        padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                    }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png" // Chef Avatar
                            alt="Avatar"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                        />
                    </div>
                    <div style={{ marginBottom: '50px' }}>
                        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.8)', margin: 0 }}>
                            {partner.name}
                        </h1>
                        <p style={{ color: '#ddd', fontSize: '1rem', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ color: '#ef4f5f' }}>📍</span> {partner.city}, {partner.state}
                        </p>
                    </div>
                </div>
            </div>

            <div className="auth-card" style={{ width: '90%', maxWidth: '1000px', margin: '60px auto 0', textAlign: 'left', background: 'transparent', boxShadow: 'none', border: 'none' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>

                    {/* Left Column: Info & Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Info Card */}
                        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', border: '1px solid #333' }}>
                            <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Restaurant Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.8rem' }}>OWNER CONTACT</label>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.contact}</p>
                                    <p style={{ color: '#ddd', margin: 0, fontSize: '0.9rem' }}>{partner.email}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.8rem' }}>FULL ADDRESS</label>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.address}</p>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.city} - {partner.pincode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div style={{ background: 'linear-gradient(135deg, #ef4f5f 0%, #ff6b6b 100%)', padding: '20px', borderRadius: '16px', color: 'white', boxShadow: '0 10px 20px rgba(239, 79, 95, 0.2)' }}>
                            <h3 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold' }}>{stats.ordersServed}</h3>
                            <p style={{ margin: 0, opacity: 0.9 }}>Happy Customers Served</p>
                        </div>

                        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.itemsAdded}</h3>
                            <p style={{ margin: 0, color: '#888' }}>Menu Items Live</p>
                        </div>

                    </div>

                    {/* Right Column: Menu & Actions */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>Live Menu</h2>
                            <button onClick={() => navigate('/add-food')} className="auth-btn" style={{ width: 'auto', padding: '10px 25px' }}>
                                + Add New Item
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {menuItems.map(item => (
                                <div key={item._id} style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', transition: 'transform 0.2s' }}>
                                    <video src={item.video} style={{ width: '100%', height: '140px', objectFit: 'cover' }} muted />
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.name}</h4>
                                        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {menuItems.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#666', border: '2px dashed #333', borderRadius: '12px' }}>
                                    <p>No food items added yet.</p>
                                    <p>Start adding detailed videos of your dishes!</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartnerProfile;
