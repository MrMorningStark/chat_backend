const bcrypt = require("bcryptjs");
const { getDB } = require("../db/mongo");

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const db = getDB();

        // Checking if username already exists
        const existing = await db.collection("users").findOne({ username });
        if (existing) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({ username, password: hashedPassword });

        res.json({ success: true });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const user = await db.collection("users").findOne({ username });
    if (!user) return res.status(401).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
    res.json({ success: true, username: user.username });
};
