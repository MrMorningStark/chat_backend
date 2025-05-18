const { getDB } = require("../db/mongo");
const online = require("../utils/onlineUsers");

exports.handleSocketConnection = (socket, io) => {
    console.log("User connected:", socket.id);

    // Storing the username and socket ID mapping
    socket.on("register", (username) => {
        socket.username = username;
        online.setOnline(username, socket.id);
        console.log(`User registered: ${username}`);
    });

    socket.on("chat message", async (msg) => {
        const db = getDB();
        const message = {
            user: msg.user,
            text: msg.text,
            timestamp: new Date(),
        };
        await db.collection("messages").insertOne(message);
        io.emit("chat message", message);
    });

    // Handling private messages
    socket.on("private message", async ({ sender, receiver, text }) => {
        const db = getDB();
        const message = {
            sender,
            receiver,
            text,
            timestamp: new Date(),
        };
        await db.collection("messages").insertOne(message);

        // Emiting the message to the receiver if they are connected to chat
        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.username === receiver
        );
        if (receiverSocket) {
            receiverSocket.emit("private message", message);
        }

        // Emiting the message back to the sender
        socket.emit("private message", message);
    });

    socket.on("disconnect", () => {
        if (socket.username) {
            online.setOffline(socket.username);
            setTimeout(() => {
                // Remove user from online list after a short delay (optional)
                online.removeUser(socket.username);
            }, 1000 * 60 * 10); // 10 minutes, adjust as needed
        }
        console.log("User disconnected:", socket.id);
    });
};