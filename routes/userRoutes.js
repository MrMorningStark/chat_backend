const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { ensureAuth } = require("../middleware/authMiddleware");

router.get("/", ensureAuth, getAllUsers);

module.exports = router;