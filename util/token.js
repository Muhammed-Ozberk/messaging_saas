const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

module.exports = {
    validate: function (token) {
        try {
            const decodedToken = jwt.verify(token, config.jwt.secretKey);
            return decodedToken;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
