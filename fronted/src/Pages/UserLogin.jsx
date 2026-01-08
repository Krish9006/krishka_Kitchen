import React from 'react';
import '../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", { email, password }, { withCredentials: true });
            if (response.status === 200) {
                alert("Login Successful!");
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login Failed");
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Log in to your account</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" className="form-input" placeholder="name@example.com" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" placeholder="Enter your password" required />
                    </div>

                    <button type="submit" className="auth-btn">Log In</button>
                </form>

                <div className="auth-footer">
                    New to Zomato? <Link to="/register" className="auth-link">Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
