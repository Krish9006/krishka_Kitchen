import React from 'react';
import '../styles/auth.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const PartnerLogin = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            // Correct API: /partner/login
            const response = await axios.post("https://krishka-kitchen-2.onrender.com/api/auth/partner/login", { email, password }, { withCredentials: true });
            if (response.status === 200) {
                alert("Login Successful!");
                // Store partner data locally
                localStorage.setItem('partner', JSON.stringify(response.data.partner));
                navigate('/partner/profile'); // Redirect to Dashboard
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login Failed");
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Partner Dashboard</h1>
                <p className="auth-subtitle">Manage your restaurant orders</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Partner Email</label>
                        <input type="email" name="email" className="form-input" placeholder="manager@restaurant.com" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" placeholder="Enter password" required />
                    </div>

                    <button type="submit" className="auth-btn">Access Dashboard</button>
                </form>

                <div className="auth-footer">
                    New Restaurant? <Link to="/food-partner/register" className="auth-link">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default PartnerLogin;
