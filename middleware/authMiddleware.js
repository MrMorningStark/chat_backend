exports.ensureAuth = (req, res, next) => {
    const { username } = req.headers;
    if (!username) return res.status(401).json({ error: "Unauthorized" });
    req.username = username;
    next();
};