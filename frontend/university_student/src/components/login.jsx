import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Email being sent:", formData.email);
        console.log("Password being sent:", formData.password);
    
        try {
            const response = await axios.post('/api/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log("Server Response:", response.data);
    
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage('Login successful');
            navigate('/applications');
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error);
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;