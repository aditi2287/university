// server.js (Backend)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }, // Add role field
});

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

const Student = mongoose.model('Student', studentSchema);

const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Correct reference!
    status: { type: String, required: true, default: 'Pending' },
    program: { type: String, required: true }, // Example: Required program
    university: { type: String },
    dateApplied: { type: Date, default: Date.now },
    // ... other application fields as needed
});

const Application = mongoose.model('Application', applicationSchema);


app.post('/api/register', async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the user already exists
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Generated Hash:", hashedPassword);

        const newUser = new Student({ name, email, password: hashedPassword });

        const savedUser = await newUser.save();

        console.log("User saved:", savedUser);

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Email received:", email);
        console.log("Password received (from frontend):", password);

        const student = await Student.findOne({ email });

        if (!student) {
            console.log("User not found!");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Student found:", student);
        console.log("Stored Hashed Password:", student.password);

        const isMatch = await bcrypt.compare(password, student.password);
        console.log("bcrypt.compare result:", isMatch);

        if (!isMatch) {
            console.log("Password does not match!");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("User authenticated successfully!");
        res.json({ message: "Login successful", user: student });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

async function authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Now, fetch the user from the database based on the ID in the token
        const user = await Student.findById(decoded.id); // Assuming 'Student' is your user model

        if (!user) {
            return res.status(401).json({ message: 'User not found' }); // Handle the case where the user is not found
        }

        req.user = user; // Attach the user object (not just the decoded token)
        console.log("User ID in authenticate middleware:", req.user._id); // Access _id after fetching
        next();
    } catch (err) {
        console.error("Authentication Error:", err); // Log the full error
        res.status(401).json({ message: 'Token is not valid or user not found' }); // More informative message
    }
}

// app.get('/api/applications', authenticate, async (req, res) => {
//     try {
//         const applications = await Application.find({ student: req.user.id }).populate('student', 'name email'); // Correct query
//         res.json(applications);
//     } catch (error) {
//         console.error("Application Fetch Error:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });


app.get('/api/applications', authenticate, async (req, res) => {
    try {
        console.log("Authenticated User ID (req.user.id):", req.user.id);
        const applications = await Application.find({ student: req.user.id }).populate('student', 'name email');
        console.log("Applications found:", applications);
        res.json(applications);
    } catch (error) {
        console.error("Application Fetch Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Example route with role-based access control
app.get('/api/admin-dashboard', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
    }
    res.send("Admin Dashboard");
});


app.listen(7000, () => {
    console.log("Server is running on port 7000");
});