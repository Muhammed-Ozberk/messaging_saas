const tokenUtil = require('../util/token');

function bearerToken(req) {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) return authorization.slice(7);
    return req.cookies && req.cookies.auth_token;
}

module.exports = function authenticate(req, res, next) {
    const decoded = tokenUtil.validate(bearerToken(req));
    if (!decoded || !decoded.sub) {
        if (req.accepts('html')) return res.redirect('/');
        return res.status(401).json({ status: false, message: 'Unauthorized.' });
    }
    req.auth = { userID: decoded.sub, token: bearerToken(req) };
    next();
};
