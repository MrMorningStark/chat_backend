const { getDB } = require("../db/mongo");

exports.getAllUsers = async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray(); // removing password from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};