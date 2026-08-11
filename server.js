const User = require("./models/models/User");
const express = require("express");
const cors = require("cors");

// Database Connection
const connectDB = require("./config/config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Public Folder Serve Karne Ke Liye
app.use(express.static("public"));

// Home Route
app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

// SAVE USER API
app.post("/users", async (req, res) => {
    try {

        const user = new User(req.body);

        await user.save();

        res.status(201).json({
            success: true,
            message: "User Saved Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// GET ALL USERS API
app.get("/users", async (req, res) => {
    try {

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});