const test = require('node:test');
const assert = require('node:assert/strict');
const token = require('../util/token');
const userRepository = require('../repositories/userRepository');
const socketController = require('../controllers/socketController');

test.beforeEach(() => { process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters'; });

function authorize(socket) {
    return new Promise((resolve) => socketController.use(socket, (error) => resolve(error)));
}

test('authenticates the socket from a signed HttpOnly cookie', async (t) => {
    const original = userRepository.findByUserID;
    userRepository.findByUserID = async (id) => ({ userID: id });
    t.after(() => { userRepository.findByUserID = original; });
    const signed = token.issue('user-1');
    const socket = { handshake: { auth: {}, headers: { cookie: `auth_token=${signed}` }, query: { userID: 'attacker' } } };
    assert.equal(await authorize(socket), undefined);
    assert.equal(socket.userID, 'user-1');
});

test('rejects a query-string identity without a token', async () => {
    const socket = { handshake: { auth: {}, headers: {}, query: { userID: 'user-1' } } };
    assert.match((await authorize(socket)).message, /Authentication error/);
});
