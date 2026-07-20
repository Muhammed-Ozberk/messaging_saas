const userData = require('./users.json');
const userRepository = require('../../repositories/userRepository');


const login = (req, res, next) => {
    res.render('pages/login', { title: "Login", });
};

const loginPost = async (req, res, next) => {
    const { userID, password } = req.body;
    const result = await userRepository.authenticate(userID, password);
    if (!result.status) return res.status(401).render('pages/login', { title: 'Login', error: 'Invalid credentials.' });
    res.cookie('auth_token', result.data.token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
    });
    res.redirect('/home/' + encodeURIComponent(result.data.userID));
};

const home = async (req, res, next) => {
    if (String(req.params.userID) !== req.auth.userID) return res.sendStatus(403);

    const users = [];    

    userData.users.forEach(user => {
        if (user.userID != req.params.userID ) {
            users.push(user);
        }
    });

    var data = {
        users: users,
        userID: req.params.userID,
    };

    res.render('pages/chats', { title: "Chats", data });
}

const chat = async (req, res, next) => {
    if (String(req.params.userID) !== req.auth.userID) return res.sendStatus(403);

    const users = [];

    userData.users.forEach(user => {
        if (user.userID != req.params.userID ) {
            users.push(user);
        }
    });

    var data = {
        users: users,
        userID: req.params.userID,
        senderID: req.params.userID,
        receiverID: req.params.receiverID,
    };
    res.render('pages/chats', { title: "Chat", data });
}

module.exports = {
    home,
    chat,
    login,
    loginPost
}
