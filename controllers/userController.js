const { getDB } = require("../db/mongo");
const online = require("../utils/onlineUsers");

exports.getAllUsers = async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
        // Add online status and last seen
        const usersWithStatus = users.map(u => ({
            ...u,
            online: online.isOnline(u.username),
            lastSeen: online.isOnline(u.username) ? null : online.getLastSeen(u.username),
        }));
        res.json(usersWithStatus);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};