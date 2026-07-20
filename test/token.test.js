const test = require('node:test');
const assert = require('node:assert/strict');
const token = require('../util/token');

test.beforeEach(() => { process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters'; });

test('issues a constrained token whose subject is the user id', () => {
    const signed = token.issue('user-1');
    const decoded = token.validate(signed);
    assert.equal(decoded.sub, 'user-1');
    assert.equal(decoded.iss, 'messaging-saas');
    assert.equal(decoded.aud, 'messaging-saas-client');
});

test('rejects tampered and missing tokens', () => {
    const signed = token.issue('user-1');
    assert.equal(token.validate(`${signed}tampered`), false);
    assert.equal(token.validate(undefined), false);
});
