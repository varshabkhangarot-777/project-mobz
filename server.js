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

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let liveUsers = [];

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.emit("userList", liveUsers);

    socket.on("joinUser", (user) => {

        socket.join("live_users");

        // Remove previous entry for same browser/session
        liveUsers = liveUsers.filter(
            (item) => item.clientId !== user.clientId
        );

        liveUsers.push({
            clientId: user.clientId,
            socketId: socket.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        });

        io.to("live_users").emit("userList", liveUsers);

        console.log("User Joined:", user.email);
        console.log("Client ID:", user.clientId);
        console.log("Socket ID:", socket.id);
        console.log("Live Users:", liveUsers);
    });

    socket.on("disconnect", () => {

        liveUsers = liveUsers.filter(
            (item) => item.socketId !== socket.id
        );

        io.to("live_users").emit("userList", liveUsers);

        console.log("User Disconnected:", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

app.post("/users", async (req, res) => {

    try {

        const user = new User(req.body);

        await user.save();

        res.status(201).json({
            success: true,
            message: "User Saved Successfully"
        });

    } catch (error) {

        console.error("Save User Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/users", async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        console.error("Get Users Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/users/:email", async (req, res) => {

    try {

        const email = decodeURIComponent(req.params.email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.error("Get User By Email Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on Port ${PORT}`);
});