const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db/mongo");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const { handleSocketConnection } = require("./socket/chatSocket");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chat-reactjs-urf9.onrender.com",
        methods: ["GET", "POST"]
    }
});

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); 

io.on("connection", (socket) => {
    handleSocketConnection(socket, io);
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});