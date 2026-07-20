const jwt = require('jsonwebtoken');

const ALGORITHM = 'HS256';
const ISSUER = 'messaging-saas';
const AUDIENCE = 'messaging-saas-client';

function secret() {
    const value = process.env.JWT_SECRET;
    if (!value || value.length < 32) {
        throw new Error('JWT_SECRET must be set and contain at least 32 characters.');
    }
    return value;
}

module.exports = {
    issue: function (userID) {
        return jwt.sign({}, secret(), {
            algorithm: ALGORITHM,
            audience: AUDIENCE,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            issuer: ISSUER,
            subject: String(userID),
        });
    },
    validate: function (token) {
        try {
            return jwt.verify(token, secret(), {
                algorithms: [ALGORITHM],
                audience: AUDIENCE,
                issuer: ISSUER,
            });
        } catch (error) {
            return false;
        }
    },
};
