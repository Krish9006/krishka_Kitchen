import React from 'react';
import '../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserRegister = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post('https://krishka-kitchen-2.onrender.com/api/auth/register', { name, email, password });
            if (response.status === 201) {
                alert("Registration Successful!");
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration Failed");
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Zomato</h1>
                <p className="auth-subtitle">Create your account to start ordering</p>

                <form className="auth-form" onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="form-input" placeholder="Vihaan Gupta" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" className="form-input" placeholder="name@example.com" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" placeholder="Create a strong password" required />
                    </div>

                    <button type="submit" className="auth-btn">Sign Up</button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Log in</Link>
                    <br /><br />
                    <Link to="/partner/register" className="auth-link">Become a Partner</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
