const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const { getConversation, getMessages } = require("../controllers/messageController");

router.get("/", ensureAuth, getMessages);
router.get("/conversation", ensureAuth, getConversation);

module.exports = router;
