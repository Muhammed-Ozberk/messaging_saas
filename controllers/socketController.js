const userRepository = require('../repositories/userRepository');
const conversationRepository = require('../repositories/conversationRepository');
const messageRepository = require('../repositories/messageRepository');
const tokenUtil = require('../util/token');

function cookieValue(header, name) {
    if (!header) return null;
    const item = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
    return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function fail(socket, event, message) {
    socket.emit('operation error', { event, message });
}

module.exports = {
    use: async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || cookieValue(socket.handshake.headers?.cookie, 'auth_token');
            const decoded = tokenUtil.validate(token);
            if (!decoded || !decoded.sub) return next(new Error('Authentication error'));
            const user = await userRepository.findByUserID(decoded.sub);
            if (!user) return next(new Error('Authentication error'));
            socket.userID = String(user.userID);
            socket.token = token;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    },

    onConnection: function (socket, io) {
        console.log("A user connected");
        socket.on("join the chat", async (data = {}) => {
            if (typeof data.receiverID !== 'string' && typeof data.receiverID !== 'number') {
                return fail(socket, 'join the chat', 'receiverID is required.');
            }
            // Brings the identity of the conversation between these two users or creates it 
            try {
                const chatResult = await conversationRepository.joinChat(socket.token, socket.userID, String(data.receiverID));
                    if (chatResult.status === false) {
                        return fail(socket, 'join the chat', chatResult.message);
                    } else {
                        // Brings the messages of the conversation
                        const messagesResult = await messageRepository.fetchMessages(socket.token, chatResult.data.conversationID);
                                if (messagesResult.status === false) {
                                    return fail(socket, 'join the chat', messagesResult.message);
                                } else {
                                    var data = {
                                        conversationID: chatResult.data.conversationID,
                                        messageData: messagesResult.data,
                                        userID: socket.userID
                                    }
                                    await socket.join(data.conversationID); // Join the conversation room
                                    socket.emit("join the chat", data); // Send the conversation ID to the front end
                                    socket.to(data.conversationID).emit("is seen", { isSeen: true });
                                }
                    }
            } catch (err) {
                fail(socket, 'join the chat', 'Unable to join conversation.');
            }
        });
        socket.on("send message", (data, callback) => this.sendMessage(io, socket, data, callback));

        socket.on("disconnect", (reason) => {
            console.log("user logged out");
        });
    },

    sendMessage: async (io, socket, data = {}, callback = () => {}) => { // Listen for new messages
        if (typeof data.conversationID !== 'string' || typeof data.message !== 'string' || !data.message.trim() || data.message.length > 4000) {
            return callback({ status: false, message: 'Invalid message payload.' });
        }
        if (!socket.rooms.has(data.conversationID)) {
            return callback({ status: false, message: 'Join the conversation before sending.' });
        }
        try {
            const connected = await io.in(data.conversationID).fetchSockets();
            const saved = await messageRepository.sendMessage(socket.token, data.conversationID, socket.userID, data.message.trim(), 'text', connected.length);
            if (!saved.status) return callback({ status: false, message: saved.message });
            callback({ status: true, isSeen: saved.data.isSeen });
            socket.to(data.conversationID).emit("receive message", {
                from: socket.userID,
                message: data.message.trim(),
                conversationID: data.conversationID,
            });
        } catch (err) {
            callback({ status: false, message: 'Unable to send message.' });
        }
    },

}
