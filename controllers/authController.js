const bcrypt = require("bcryptjs");
const { getDB } = require("../db/mongo");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Multer setup for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.signup = [
    upload.single("avatar"),
    async (req, res) => {
        const { username, password } = req.body;
        let avatarUrl = null;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        try {
            const db = getDB();

            // Check if username already exists
            const existing = await db.collection("users").findOne({ username });
            if (existing) {
                return res.status(409).json({ error: "Username already exists" });
            }

            // If avatar is provided, upload to Cloudinary
            if (req.file) {
                const result = await cloudinary.uploader.upload_stream(
                    { resource_type: "image", folder: "chat_avatars" },
                    (error, result) => {
                        if (error) throw error;
                        avatarUrl = result.secure_url;
                    }
                );
                // Wait for upload to finish
                await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "chat_avatars" },
                        (error, result) => {
                            if (error) return reject(error);
                            avatarUrl = result.secure_url;
                            resolve();
                        }
                    );
                    stream.end(req.file.buffer);
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.collection("users").insertOne({
                username,
                password: hashedPassword,
                avatar: avatarUrl,
            });

            res.json({ success: true });
        } catch (err) {
            console.error("Error during signup:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
];

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const user = await db.collection("users").findOne({ username });
    if (!user) return res.status(401).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
    res.json({ success: true, data: { username: user.username, avatar: user.avatar } });
};
