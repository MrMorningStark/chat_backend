const { getDB } = require("../db/mongo");

exports.getMessages = async (req, res) => {
    try {
        const db = getDB();
        const messages = await db.collection("messages").find({}).sort({ timestamp: 1 }).toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

exports.getConversation = async (req, res) => {
    const { user1, user2 } = req.query;
    try {
        const db = getDB();
        const messages = await db.collection("messages").find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
        }).sort({ timestamp: 1 }).toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
};
