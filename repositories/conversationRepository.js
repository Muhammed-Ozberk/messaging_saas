const baseRepository = require('./base/baseRepository');
const tokenUtil = require('../util/token');

/** DB Models */
const allModels = require("../models");
const Conversations = allModels.Conversations;
const Users = allModels.Users;
/** DB Models END */

module.exports = {

    joinChat: async (token, senderID, receiverID) => {

        let conversationID = null;

        if (typeof token === 'undefined' || token === null || token === '') {
            return { status: false, message: "token object required." };
        } else if (typeof senderID === 'undefined' || senderID === null || senderID === '') {
            return { status: false, message: "senderID object required." };
        } else if (typeof receiverID === 'undefined' || receiverID === null || receiverID === '') {
            return { status: false, message: "receiverID object required." };
        } else {
            const decoded = tokenUtil.validate(token);
            if (!decoded) return { status: false, message: "Invalid token." };
            try {

                const userOne = await baseRepository.findOne(Users, { userID: senderID });
                if (!userOne) return { status: false, message: "Sender not found." };

                const userTwo = await baseRepository.upsert(Users, { userID: receiverID });

                const conversation = await baseRepository.findOneOr(Conversations, [
                    {
                        userOne: senderID,
                        userTwo: receiverID
                    },
                    {
                        userOne: receiverID,
                        userTwo: senderID
                    }
                ]); // Check if conversation exists

                if (!conversation) { // If conversation does not exist, create conversation
                    const savedConversation = await baseRepository.create(Conversations, {
                        userOne: senderID,
                        userTwo: receiverID,
                    });
                    conversationID = savedConversation.conversationID;
                } else {
                    conversationID = conversation.conversationID;
                }

                const data = {
                    userOneID: senderID,
                    userTwoID: receiverID,
                    conversationID: conversationID,
                };
                return { status: true, data: data };

            } catch (error) {
                console.log(error);
                return { status: false, message: "System error." };
            }
        }
    },
}