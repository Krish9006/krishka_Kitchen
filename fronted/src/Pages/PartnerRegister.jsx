import React from 'react';
import '../styles/auth.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerRegister = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collect all form data
        const formData = {
            name: e.target.name.value,
            contact: e.target.contact.value,
            email: e.target.email.value,
            password: e.target.password.value,
            address: e.target.address.value,
            city: e.target.city.value,
            state: e.target.state.value,
            pincode: e.target.pincode.value,
        };

        try {
            // Correct Port 3000
            const response = await axios.post('https://krishka-kitchen-2.onrender.com/api/auth/partner/register', formData, { withCredentials: true });
            if (response.status === 201) {
                alert("Restaurant Registered Successfully!");
                navigate('/food-partner/login');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration Failed");
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '800px' }}>
                <h1 className="auth-title">Partner with Zomato</h1>
                <p className="auth-subtitle">Register your restaurant and grow your business</p>

                <form className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} onSubmit={handleSubmit}>
                    {/* Restaurant Details */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ textAlign: 'left', marginBottom: '10px', color: 'var(--primary-color)' }}>Restaurant Details</h3>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Restaurant Name</label>
                        <input type="text" name="name" className="form-input" placeholder="My Awesome Cafe" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Number</label>
                        <input type="tel" name="contact" className="form-input" placeholder="+91 9876543210" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Owner Email</label>
                        <input type="email" name="email" className="form-input" placeholder="manager@restaurant.com" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" placeholder="Secure password" required />
                    </div>

                    {/* Address Details */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <h3 style={{ textAlign: 'left', marginBottom: '10px', color: 'var(--primary-color)' }}>Location</h3>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Full Address</label>
                        <input type="text" name="address" className="form-input" placeholder="Shop No. 1, Main Market..." required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" name="city" className="form-input" placeholder="Mumbai" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">State</label>
                        <input type="text" name="state" className="form-input" placeholder="Maharashtra" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input type="text" name="pincode" className="form-input" placeholder="400001" required />
                    </div>

                    <button type="submit" className="auth-btn" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>Register Restaurant</button>
                </form>

                <div className="auth-footer">
                    Already a partner? <Link to="/food-partner/login" className="auth-link">Partner Login</Link>
                </div>
            </div>
        </div>
    );
};

export default PartnerRegister;
