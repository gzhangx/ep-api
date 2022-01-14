import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as dbAccess from '../utils/dbAccess';
import * as uuid from 'uuid';
import * as googleEmail from '../utils/googleMail';
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
    await dbAccess.updateUser(user.id, {
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


export async function resetPassword(event: any) {
    const { username, } = event;
    const user = await dbAccess.findUserByUserName(username);
    if (!user) {
        return { error: `no user ${username}` };
    }
    const id = uuid.v1();
    const password = id.substr(0, 5);
        
            
    await dbAccess.updateUser(user.id, {
        password: authP.getPwdHash(password),
    });

    const subject = `Your Reset Password`;
    const text = `Dear ${username}, your temp password is ${password}`;
    console.log(`sending email`);
    
    await googleEmail.sendGoogleMail(username, subject, text);
    return {
        message: 'password reset',
    }
}