const userRepository = require('../repositories/userRepository');
const conversationRepository = require('../repositories/conversationRepository');
const messageRepository = require('../repositories/messageRepository');

module.exports = {
    use: (socket, next) => {
        if (typeof socket.handshake.query === 'undefined' || socket.handshake.query === null || socket.handshake.query === '') {
            next(new Error('Authentication error'));
        } else if (typeof socket.handshake.query.userID === 'undefined' || socket.handshake.query.userID === null || socket.handshake.query.userID === '') {
            next(new Error('Authentication error'));
        } else {
            // Registering if no user exists
            userRepository.loginSocket(socket.handshake.query.userID)
                .then((result) => {
                    if (result.status === false) {
                        next(new Error('Authentication error'));
                    } else {
                        socket.userID = result.data.userID; // User ID sent to us by Clint
                        socket.token = result.data.token; // Token sent to us by Clint
                        next();
                    }
                }).catch((err) => {
                    console.log(err);
                    next(new Error('Authentication error'));
                });
        }
    },

    onConnection: function (socket, io) {
        console.log("A user connected");
        socket.on("join the chat", (data) => {
            // Brings the identity of the conversation between these two users or creates it 
            conversationRepository.joinChat(socket.token, socket.userID, data.receiverID)
                .then((chatResult) => {
                    if (chatResult.status === false) {
                        console.log(chatResult.message); // res.systemError
                    } else {
                        // Brings the messages of the conversation
                        messageRepository.fetchMessages(socket.token, chatResult.data.conversationID)
                            .then((messagesResult) => {
                                if (messagesResult.status === false) {
                                    console.log(messagesResult.message);
                                } else {
                                    var data = {
                                        conversationID: chatResult.data.conversationID,
                                        messageData: messagesResult.data,
                                        userID: socket.userID,
                                        token: socket.token
                                    }
                                    socket.join(data.conversationID); // Join the conversation room
                                    socket.emit("join the chat", data); // Send the conversation ID to the front end
                                    socket.to(data.conversationID).emit("is seen", { isSeen: true });
                                }
                            }).catch((err) => {
                                console.log(err); // res.systemError
                            });
                    }
                }
                ).catch((err) => {
                    console.log(err); // res.systemError
                }
                );
        });
        socket.on("send message", (data, callback) => this.sendMessage(io, socket, data, callback));

        socket.on("disconnect", (reason) => {
            console.log("user logged out");
        });
    },

    sendMessage: (io, socket, data, callback) => { // Listen for new messages   
        io.in(`${data.conversationID}`).fetchSockets().then((result) => {
            messageRepository.sendMessage(socket.token, data.conversationID, socket.userID, data.message, "text", result.length);
            if (result.length != 2) {
                callback({ isSeen: false })
            } else {
                callback({ isSeen: true })
            }
        }).catch((err) => {
            console.log(err);
        });
        socket.to(data.conversationID).emit("receive message", { // Send the message to the other person in the conversation    
            from: socket.userID, // The person who sent the message
            message: data.message, // The message content
            conversationID: data.conversationID // The conversation the message is in
        });
    },

}