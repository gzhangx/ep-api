import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
export async function auth(event: any) {

    const { username, password } = event;

    const user = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: username },
        { name: 'password', value: password },
    ]);
    if (!user) {
        return { error: `no user ${username}` };
    }

    console.log(user)

    const signed = authP.signUser(user);
    return signed;
}
