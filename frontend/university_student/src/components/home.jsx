// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <h1>Welcome to University Insights</h1>
            <div className="buttons-container">
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
                <button className="register-button" onClick={handleRegister}>
                    Register
                </button>
            </div>
            {/* You can add more content here if needed */}
        </div>
    );
};

export default Home;