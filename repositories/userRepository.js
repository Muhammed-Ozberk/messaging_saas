const baseRepository = require('./base/baseRepository');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');


/** DB Models */
const allModels = require("../models");
const Users = allModels.Users;
/** DB Models END */

module.exports = {

    loginSocket: async function (userID) {

        try {

            await baseRepository.upsert(Users, { userID: userID });

            token = jwt.sign({
                userID: userID,
            }, config.jwt.secretKey, config.jwt.options);

            const data = {
                userID: userID,
                token: token,
            };

            return { status: true, data: data };
        } catch (error) {
            console.log(error);
            return { status: false, message: "System error." };
        }

    },

}