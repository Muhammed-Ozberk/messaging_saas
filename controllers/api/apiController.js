const userRepository = require('../../repositories/userRepository');
const conversationRepository = require('../../repositories/conversationRepository');
const messageRepository = require('../../repositories/messageRepository');

module.exports = {

    /** GET /api/login-socket/:userID */
    loginSocket: (req, res, next) => {
        const { userID } = req.params;

        if (typeof userID === 'undefined' || userID === null || userID === '') {
            return res.missingField("query", "userID", "userID object required.");
        } else {
            userRepository.loginSocket(userID)
                .then((result) => {
                    if (result.status === false) {
                        console.log(result);
                        return res.sysError();
                    } else {
                        return res.successful(result.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    return res.sysError();
                });

        }
    },
    /** GET /api/login-socket/:userID END */

    /** GET /api/join-chat/:senderID/:receiverID */
    joinChat: async (req, res, next) => {
        const { senderID, receiverID } = req.params;
        if (typeof req.headers.authorization === 'undefined' || req.headers.authorization === null || req.headers.authorization === '') {
            return res.missingField("query", "authorization", "authorization object required.");
        } else if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return res.missingField("query", "senderID", "senderID object required.");
        } else if (typeof receiverID === 'undefined' || receiverID === null || receiverID === '') {
            return res.missingField("query", "receiverID", "receiverID object required.");
        } else {

            if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
                return res.missingField("query", "token", "token object required.");
            }

            const token = req.headers.authorization.split(" ")[1];

            conversationRepository.joinChat(token, senderID, receiverID)
                .then((result) => {
                    if (result.status === false) {
                        console.log(result);
                        return res.sysError();
                    } else {
                        return res.successful(result.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    return res.sysError();
                });
        }
    },
    /** GET /api/join-chat/:senderID/:receiverID END */

    /** POST /api/send-message */
    sendMessage: async (req, res, next) => {
        const { conversationID, senderID, content, messageType } = req.body;

        if (typeof req.headers.authorization === 'undefined' || req.headers.authorization === null || req.headers.authorization === '') {
            return res.missingField("query", "authorization", "authorization object required.");
        } else if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return res.missingField("body", "conversationID", "conversationID object required.");
        } else if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return res.missingField("body", "senderID", "senderID object required.");
        } else if (typeof content === 'undefined' || content === null || content === '') {
            return res.missingField("body", "content", "content object required.");
        } else if (typeof messageType === 'undefined' || messageType === null || messageType === '') {
            return res.missingField("body", "messageType", "messageType object required.");
        } else {

            if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
                return res.missingField("query", "token", "token object required.");
            }

            const token = req.headers.authorization.split(" ")[1];

            messageRepository.sendMessage(token, conversationID, senderID, content, messageType)
                .then((result) => {
                    if (result.status === false) {
                        console.log(result);
                        return res.sysError();
                    } else {
                        return res.successful(result.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    return res.sysError();
                });
        }
    },
    /** POST /api/send-message END */

    /** GET /api/fetch-messages/:conversationID */
    fetchMessages: async (req, res, next) => {
        const { conversationID } = req.params;
        let { limit } = req.query;

        if (typeof req.headers.authorization === 'undefined' || req.headers.authorization === null || req.headers.authorization === '') {
            return res.missingField("query", "authorization", "authorization object required.");
        } else if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return res.missingField("query", "conversationID", "conversationID object required.");
        } else {

            if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
                return res.missingField("query", "token", "token object required.");
            }

            const token = req.headers.authorization.split(" ")[1];

            messageRepository.fetchMessages(token, conversationID, limit)
                .then((result) => {
                    if (result.status === false) {
                        console.log(result.message);
                        return res.sysError();
                    } else {
                        return res.successful(result.data);
                    }
                }).catch((err) => {
                    console.log(err);
                    return res.sysError();
                });
        }
    }
    /** GET /api/fetch-messages/:conversationID END */
}