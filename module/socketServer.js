var app = require('../app');
const http = require('http').Server(app);
const socketController = require('../controllers/socketController');

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

module.exports = {
    _socket: null,

    attach: function (server) {

        if (this._socket == null) {
            this._socket = io.attach(server);
            io.use((socket, next) => socketController.use(socket, next))
                .on("connection", async (socket) => socketController.onConnection(socket, io));
        }
    },
}

