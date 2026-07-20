const baseRepository = require('./base/baseRepository');
const passwordUtil = require('../util/password');
const tokenUtil = require('../util/token');


/** DB Models */
const allModels = require("../models");
const Users = allModels.Users;
/** DB Models END */

module.exports = {

    authenticate: async function (userID, password) {
        try {
            const user = await baseRepository.findOne(Users, { userID: String(userID) });
            if (!user || !await passwordUtil.verify(password, user.passwordHash)) {
                return { status: false, message: 'Invalid credentials.' };
            }
            return { status: true, data: { userID: user.userID, token: tokenUtil.issue(user.userID) } };
        } catch (error) {
            console.log(error);
            return { status: false, message: "System error." };
        }
    },

    create: async function (userID, password) {
        const existing = await baseRepository.findOne(Users, { userID: String(userID) });
        if (existing) {
            if (!existing.passwordHash) {
                existing.passwordHash = await passwordUtil.hash(password);
                await existing.save();
            }
            return existing;
        }
        return baseRepository.create(Users, {
            userID: String(userID),
            passwordHash: await passwordUtil.hash(password),
        });
    },

    findByUserID: (userID) => baseRepository.findOne(Users, { userID: String(userID) }),

};
