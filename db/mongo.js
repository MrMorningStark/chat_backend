const { MongoClient } = require("mongodb");

const URI = process.env.MONGO_DB_URI;
const DB_NAME = process.env.DB_NAME;

let client;
let db;

const connectDB = async () => {
    try {
        client = new MongoClient(URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
};

const getDB = () => db;

module.exports = connectDB;
module.exports.getDB = getDB;