const crypto = require('crypto');
const uuid = require('uuid')
const secret = {
    seed: uuid.v1(),
    pwdSeed: 'somethingUniqueDontChange',
}

function getUserKey(user) {
    return `${user.username}:${user.password}`;
}

///
// user: username, password, provider, id, created, verified
//
//
///
function getUserHash(user) {
    return crypto
        .createHmac('sha256', secret.seed)
        .update(getUserKey(user))
        .digest('hex');
}

function getPwdHash(pwd) {
    return crypto
        .createHmac('sha256', secret.pwdSeed)
        .update(pwd)
        .digest('hex');
}

function signUser(user) {
    return {
        ...user,
        hash: getUserHash(user)
    }
}

function verifyUser(user) {
    const hash = getUserHash(user);
    return (user.hash === hash)
}

module.exports = {
    signUser,
    verifyUser,
    getPwdHash,
}