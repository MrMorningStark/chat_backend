const onlineUsers = new Map(); // username -> { socketId, lastSeen: Date }

function setOnline(username, socketId) {
    onlineUsers.set(username, { socketId, lastSeen: new Date() });
}

function setOffline(username) {
    if (onlineUsers.has(username)) {
        const user = onlineUsers.get(username);
        user.lastSeen = new Date();
        onlineUsers.set(username, user);
    }
}

function removeUser(username) {
    onlineUsers.delete(username);
}

function isOnline(username) {
    return onlineUsers.has(username);
}

function getLastSeen(username) {
    const user = onlineUsers.get(username);
    return user ? user.lastSeen : null;
}

function getOnlineUsers() {
    return Array.from(onlineUsers.keys());
}

module.exports = {
    setOnline,
    setOffline,
    removeUser,
    isOnline,
    getLastSeen,
    getOnlineUsers,
    onlineUsers,
};