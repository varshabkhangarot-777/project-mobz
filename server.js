require("dotenv").config();

const User = require("./models/models/User");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/config/db");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// MongoDB Connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Live Users Array
let liveUsers = [];

// Socket Connection
io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // Send current users to newly connected client
    socket.emit("userList", liveUsers);

    socket.on("joinUser", (user) => {

        // Join Room
        socket.join("live_users");

        const existingUser = liveUsers.find(
            u => u.email === user.email
        );

        if (!existingUser) {

            liveUsers.push({
                socketId: socket.id,
                email: user.email,
                name: user.firstName + " " + user.lastName
            });

        }

        io.to("live_users").emit("userList", liveUsers);
    });

    socket.on("disconnect", () => {

        liveUsers = liveUsers.filter(
            user => user.socketId !== socket.id
        );

        io.to("live_users").emit("userList", liveUsers);

        console.log("User Disconnected:", socket.id);
    });
});

// Home Route
app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

// Save User
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

// Get All Users
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

// Get User By Email
app.get("/users/:email", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.params.email
        });

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start Server
server.listen(3000, () => {
    console.log("Server Running on Port 3000");
});