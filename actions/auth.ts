import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as dbAccess from '../utils/dbAccess';
export async function auth(event: any) {

    const { username, password } = event;

    const user = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: username },
        { name: 'password', value: password },
    ]) as authP.User;
    if (!user) {
        return { error: `no user ${username}` };
    }
    if (!user.active) {
        return { error: `You (${username}) are no longer active` };
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
