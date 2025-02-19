// Register.jsx (or your Register component file)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', formData);
            setMessage('Registration successful');
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            setMessage(error.response.data.message || 'Registration failed');
        }
    };

    return (
        <div className="register-container"> {/* Add a container div */}
            <div className="register-form"> {/* Wrap the form in a div */}
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Register;