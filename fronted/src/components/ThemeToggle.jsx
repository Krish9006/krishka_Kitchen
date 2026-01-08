import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    // Hide toggle on Home page (path is '/')
    if (window.location.pathname === '/') return null;

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '10px 15px',
                borderRadius: '30px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--shadow-color)',
                fontSize: '1.2rem',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? '🌙' : '☀️'}
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                {theme === 'light' ? 'Dark' : 'Light'}
            </span>
        </button>
    );
};

export default ThemeToggle;
