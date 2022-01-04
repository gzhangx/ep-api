import * as crypto from "crypto";
import * as uuid from 'uuid';
const secret = {
    dynamicSeed: 'somethingUniqueThatCanChangeb1b171c1252',
    pwdSeed: 'somethingUniqueDontChange',
}

export interface User {
    id: string;
    username: string;
    password: string;
    provider: string;
    active: boolean;
    verified: boolean;
    created: string;
    lastSignIn: string;
}

export interface HashedObject {
    hash: string,
    nonce: string,
}

function getUserKey(user: User, nonce: string) {
    return `${user.username}:${secret.dynamicSeed}:${nonce}`;
}

///
// user: username, password, provider, id, created, verified
//
//
///
function getUserHash(user: User, nonce:string) {
    return crypto
        .createHmac('sha256', secret.dynamicSeed)
        .update(getUserKey(user, nonce))
        .digest('hex');
}

export function getPwdHash(pwd: string) {
    return crypto
        .createHmac('sha256', secret.pwdSeed)
        .update(pwd)
        .digest('hex');
}

export function signUser(user: User): HashedObject {
    const nonce = new Date().toISOString();
    return {
        hash: getUserHash(user, nonce),
        nonce,
    }
}

export function verifyUser(user: User, hash: HashedObject) {
    const nhash = getUserHash(user, hash.nonce);
    return (hash.hash === nhash)
}

