import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchApplications = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/applications', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setApplications(response.data);
                    console.log("Applications data received:", response.data);
                } else {
                    console.error("Error fetching applications:", response.status, response.data);
                    setError("Error fetching applications");
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch applications');
                console.error("Error fetching applications:", err);
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <div>Loading applications...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container"> {/* Container for centering */}
            <div className="user-info"> {/* User info section */}
                {user && (
                    <div>
                        <p>Welcome, {user.name}!</p>
                        <p>User ID: {user._id}</p>
                        <p>Role: {user.role}</p>
                        {user.role === 'student' && (
                            <div className="student-features">
                                <h2>Student Features</h2>
                                <p>Application Tracking</p>
                                <p>AI Profile Matcher</p>
                                <p>Scholarship Finder</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="applications-section"> {/* Applications section */}
                <h2>My Applications</h2>
                {applications.length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    <ul>
                        {applications.map((app) => (
                            <li key={app._id}>
                                <p>Status: {app.status}</p>
                                {/* ... other application details */}
                                {app.student && <p>Student Name: {app.student.name}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Applications;