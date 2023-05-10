const baseRepository = require('./base/baseRepository');
const tokenUtil = require('../util/token');

/** DB Models */
const allModels = require("../models");
const Messages = allModels.Messages;
const Conversations = allModels.Conversations;
/** DB Models END */

module.exports = {

    fetchMessages: async (token, conversationID, limit) => {

        if (typeof token === 'undefined' || token === null || token === '') {
            return { status: false, message: "token object required." };
        } else if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return { status: false, message: "conversationID object required." };
        } else {
            const decoded = tokenUtil.validate(token);
            if (!decoded) return { status: false, message: "Invalid token." };
            if (typeof limit === 'undefined' || limit === null || limit === '') {
                limit = 10;
            }
            limit = parseInt(limit);
            try {
                const messages = await baseRepository.findAllWithPaginationAndOrder(Messages,
                    {
                        conversationID: conversationID
                    },
                    limit,
                    [
                        ['createdAt', 'DESC']
                    ],
                );
                let seenUser = null;
                let isSeen = false;

                const conversation = await baseRepository.findOne(Conversations, {
                    conversationID: conversationID
                });

                if (conversation) {
                    if (conversation.seen) {
                        if (conversation.seen == "false") {
                            seenUser = decoded.userID;
                        } else if (conversation.seen.includes(decoded.userID)) {
                            seenUser = conversation.seen;
                        } else {
                            seenUser = conversation.seen + ":" + decoded.userID;
                        }
                    }
                    if (seenUser.includes(decoded.userID) && seenUser.length > 33) {
                        isSeen = true;
                    }

                    if (seenUser != conversation.seen) {
                        await baseRepository.update(Conversations, {
                            seen: seenUser
                        }, {
                            conversationID: conversationID
                        });
                    }

                    messages.reverse();

                    return { status: true, data: { messages, isSeen } };
                } else {
                    return { status: false, message: "Conversation not found." };
                }
            } catch (error) {
                console.log(error);
                return { status: false, message: "System error." };
            }
        }
    },

    sendMessage: async (token, conversationID, senderID, content, messageType, activeUsers) => {

        if (typeof token === 'undefined' || token === null || token === '') {
            return { status: false, message: "token object required." };
        } else if (typeof conversationID === 'undefined' || conversationID === null || conversationID === '') {
            return { status: false, message: "conversationID object required." };
        } else if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return { status: false, message: "senderID object required." };
        } else if (typeof content === 'undefined' || content === null || content === '') {
            return { status: false, message: "content object required." };
        } else if (typeof messageType === 'undefined' || messageType === null || messageType === '') {
            return { status: false, message: "messageType object required." };
        } else {
            const decoded = tokenUtil.validate(token);
            if (!decoded) return { status: false, message: "Invalid token." };
            try {
                const savedMessage = await baseRepository.create(Messages, {
                    conversationID: conversationID,
                    senderID: senderID,
                    content: content,
                    messageType: messageType
                });
                let isSeen = true;
                if (activeUsers != 2) {
                    await baseRepository.update(Conversations, {
                        seen: senderID
                    }, {
                        conversationID: conversationID
                    });
                    isSeen = false;
                }

                const data = {
                    isSeen: isSeen,
                };
                return { status: true, data: data };
            } catch (error) {
                console.log(error);
                return { status: false, message: "System error." };
            }
        }
    },

}