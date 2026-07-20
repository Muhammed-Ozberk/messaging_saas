const bcrypt = require('bcryptjs');

const DEFAULT_COST = 12;

function getCost() {
    const cost = Number.parseInt(process.env.BCRYPT_COST || DEFAULT_COST, 10);
    if (!Number.isInteger(cost) || cost < 10 || cost > 15) {
        throw new Error('BCRYPT_COST must be an integer between 10 and 15.');
    }
    return cost;
}

module.exports = {
    hash: (password) => {
        if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
            throw new Error('Password must contain between 12 and 128 characters.');
        }
        return bcrypt.hash(password, getCost());
    },
    verify: (password, passwordHash) => {
        if (typeof password !== 'string' || typeof passwordHash !== 'string') return false;
        return bcrypt.compare(password, passwordHash);
    },
};
