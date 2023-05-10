const md5 = require('md5');
const userData = require('./users.json');


const login = (req, res, next) => {
    res.render('pages/login', { title: "Login", });
};

const loginPost = (req, res, next) => {
    const { userID } = req.body;
    res.redirect('/home/' + userID);
};

const home = async (req, res, next) => {

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