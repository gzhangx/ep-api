import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as dbAccess from '../utils/dbAccess';
export async function auth(event: any) {

    const { username, password,  } = event;

    const user = await dbAccess.findUserByUserName(username);
        //await db.getOneByNameValuePairs('loginClients', [
        //{ name: 'username', value: username },
        //{ name: 'password', value: password },
    //]) as authP.User;
    if (!user) {
        return { error: `no user ${username}` };
    }
    if (!user.active) {
        return { error: `You (${username}) are no longer active` };
    }

    if (user.password !== authP.getPwdHash(password)) {
        return { error: 'Invalid pwd' };
    }
    if (!user.verified) {
        user.verified = true;
    }
    await dbAccess.saveUser(user.id, {
        verified: true,
    })
    console.log(user)

    const signed = authP.signUser(user);
    return signed;
}

export function verifyAuth(event: any) {
    const { loginInfo } = event;
    if (!loginInfo) return false;
    const { username, nonce, hash } = loginInfo;
    const hashObj: authP.HashedObject = {
        hash,
        nonce,
    };
    return authP.verifyUser({
        username,
    } as authP.User, hashObj);
}