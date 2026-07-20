const userRepository = require('../../repositories/userRepository');
const conversationRepository = require('../../repositories/conversationRepository');
const messageRepository = require('../../repositories/messageRepository');

module.exports = {

    login: async (req, res) => {
        const { userID, password } = req.body || {};
        if (typeof userID !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ status: false, message: 'userID and password are required.' });
        }
        const result = await userRepository.authenticate(userID, password);
        if (!result.status) return res.status(401).json({ status: false, message: 'Invalid credentials.' });
        return res.status(200).json({ status: true, data: result.data });
    },

    /** GET /api/join-chat/:senderID/:receiverID */
    joinChat: async (req, res, next) => {
        const { senderID, receiverID } = req.params;
        if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return res.missingField("query", "senderID", "senderID object required.");
        } else if (typeof receiverID === 'undefined' || receiverID === null || receiverID === '') {
            return res.missingField("query", "receiverID", "receiverID object required.");
        } else {

            const token = req.auth.token;

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
        const { conversationID, content, messageType } = req.body;
        const senderID = req.auth.userID;

        if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return res.missingField("body", "conversationID", "conversationID object required.");
        } else if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return res.missingField("body", "senderID", "senderID object required.");
        } else if (typeof content === 'undefined' || content === null || content === '') {
            return res.missingField("body", "content", "content object required.");
        } else if (typeof messageType === 'undefined' || messageType === null || messageType === '') {
            return res.missingField("body", "messageType", "messageType object required.");
        } else {

            const token = req.auth.token;

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

        if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return res.missingField("query", "conversationID", "conversationID object required.");
        } else {

            const token = req.auth.token;

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
