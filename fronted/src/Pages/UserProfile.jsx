import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('https://krishka-kitchen-2.onrender.com/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('https://krishka-kitchen-2.onrender.com/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="loading-screen">Loading Profile...</div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <i className="ri-arrow-left-line"></i>
                </button>
                <h2>My Profile</h2>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="ri-logout-box-r-line"></i>
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=ff4757&color=fff&size=128`}
                        alt="Profile"
                    />
                </div>

                {!isEditing ? (
                    <div className="profile-info-view">
                        <h3>{user?.name}</h3>
                        <p className="user-email">{user?.email}</p>

                        <div className="info-card">
                            <div className="info-row">
                                <i className="ri-map-pin-user-fill"></i>
                                <span>{user?.address || "No address added"}</span>
                            </div>
                            <div className="info-row">
                                <i className="ri-phone-fill"></i>
                                <span>{user?.phone || "No phone number"}</span>
                            </div>
                        </div>

                        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                placeholder="Enter your number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                placeholder="Enter your delivery address"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Save Changes</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
