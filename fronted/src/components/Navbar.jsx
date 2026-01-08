import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartClick }) => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Check login state (Naive check for demo)
    const user = JSON.parse(localStorage.getItem('user'));
    const partner = JSON.parse(localStorage.getItem('foodpartner'));

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Implement search logic or navigation here
        console.log("Searching for:", e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <nav className="navbar-container">
            {/* Logo */}
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">🔥</span>
                Krishka Kitchen
            </Link>

            {/* Search Bar */}
            <div className="navbar-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for restaurant, cuisine or a dish"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Right Side Links */}
            <div className="navbar-links">
                {/* Partner Link */}
                {!partner && (
                    <Link to="/food-partner/register" className="nav-link partner-link">
                        Add Restaurant
                    </Link>
                )}

                {/* Authentication / Profile */}
                {user ? (
                    <div className="auth-dropdown">
                        <div className="user-avatar" title={user.name}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="dropdown-menu">
                            <span className="dropdown-item" style={{ fontWeight: 'bold', color: 'white' }}>{user.name}</span>
                            <div className="dropdown-divider"></div>
                            <Link to="/profile" className="dropdown-item">Profile</Link>
                            <Link to="/orders" className="dropdown-item">Orders</Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item" style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Log out</button>
                        </div>
                    </div>
                ) : partner ? (
                    <div className="auth-dropdown">
                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #4fef5f, #6bff7a)' }} title={partner.name}>
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="dropdown-menu">
                            <span className="dropdown-item" style={{ fontWeight: 'bold', color: 'white' }}>{partner.name} (Partner)</span>
                            <div className="dropdown-divider"></div>
                            <Link to="/partner-profile" className="dropdown-item">Dashboard</Link>
                            <Link to="/add-food" className="dropdown-item">Add Menu Item</Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item" style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Log out</button>
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
                        <div className="auth-dropdown">
                            <button className="login-btn">Log in</button>
                            <div className="dropdown-menu">
                                <Link to="/login" className="dropdown-item">User Login</Link>
                                <Link to="/partner-login" className="dropdown-item">Partner Login</Link>
                            </div>
                        </div>
                        <Link to="/signup" className="signup-btn hide-mobile">Sign up</Link>
                    </div>
                )}

                {/* Cart Icon */}
                <div className="cart-icon-wrapper" onClick={onCartClick}>
                    <span style={{ fontSize: '1.4rem' }}>🛒</span>
                    {cart.length > 0 && (
                        <div className="cart-badge">{cart.length}</div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
