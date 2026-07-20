const test = require('node:test');
const assert = require('node:assert/strict');
const password = require('../util/password');

test('bcrypt hashes and verifies a password without storing plaintext', async () => {
    process.env.BCRYPT_COST = '10';
    const plain = 'correct horse battery staple';
    const hash = await password.hash(plain);
    assert.match(hash, /^\$2[aby]\$10\$/);
    assert.notEqual(hash, plain);
    assert.equal(await password.verify(plain, hash), true);
    assert.equal(await password.verify('wrong password', hash), false);
});

test('weak passwords are rejected', async () => {
    assert.throws(() => password.hash('short'), /between 12 and 128/);
});
