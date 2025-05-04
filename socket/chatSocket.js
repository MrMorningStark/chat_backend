const { getDB } = require("../db/mongo");

exports.handleSocketConnection = (socket, io) => {
    console.log("User connected:", socket.id);

    // Storing the username and socket ID mapping
    socket.on("register", (username) => {
        socket.username = username;
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
        console.log("User disconnected:", socket.id);
    });
};