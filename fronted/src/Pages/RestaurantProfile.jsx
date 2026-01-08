import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css'; // Reusing styles

const RestaurantProfile = () => {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(`https://krishka-kitchen-2.onrender.com/api/food/restaurant/${id}`);

                if (response.data && response.data.length > 0) {
                    setMenuItems(response.data);
                    // Extract partner details from the first food item's populated field
                    setPartner(response.data[0].foodpartner);
                } else {
                    // Handle case where partner exists but has no food (API limitation for now)
                    // We might need a separate API to fetch Partner details by ID if we want to show empty profiles.
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantData();
    }, [id]);

    if (loading) return <div style={{ color: 'white', padding: '50px' }}>Loading Restaurant...</div>;
    if (!partner) return <div style={{ color: 'white', padding: '50px' }}>Restaurant not found or has no menu yet.</div>;

    return (
        <div className="start-screen-container" style={{ background: '#000', minHeight: '100vh', paddingBottom: '50px' }}>

            {/* Cover & Header */}
            <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                <img
                    src="https://b.zmtcdn.com/data/pictures/chains/8/310088/2544e3d3090680072b226e797e8b835e.jpeg?fit=around|960:500&crop=960:500;*,*"
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }}
                />
                <div style={{ position: 'absolute', bottom: '-40px', left: '5%', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%', background: '#fff',
                        padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                    }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1996/1996068.png" // Different Avatar for public view
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

                    {/* Info Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '16px', border: '1px solid #333' }}>
                            <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Restaurant Info</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.8rem' }}>ADDRESS</label>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.address}</p>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.city} - {partner.pincode}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.8rem' }}>CONTACT</label>
                                    <p style={{ color: '#ddd', margin: 0 }}>{partner.contact}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Column */}
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '20px' }}>Menu ({menuItems.length} Items)</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {menuItems.map(item => (
                                <div key={item._id} style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                                    <video src={item.video} style={{ width: '100%', height: '140px', objectFit: 'cover' }} muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>{item.name}</h4>
                                        <p style={{ color: '#888', fontSize: '0.85rem' }}>{item.description.substring(0, 60)}...</p>
                                        <button className="auth-btn" style={{ marginTop: '10px', padding: '8px', fontSize: '0.8rem' }} onClick={() => alert("Order feature coming soon!")}>
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;
