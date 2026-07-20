var app = require('../app');
const http = require('http').Server(app);
const socketController = require('../controllers/socketController');

const allowedOrigins = (process.env.SOCKET_ALLOWED_ORIGINS || 'http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim());

const io = require('socket.io')(http, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
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
