import * as authP from './utils/authProvider';
import * as db from './utils/db';

async function test() {

    const user1 = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: 'gg' },
        { name: 'password', value: 'zz1' }
    ])

    console.log(user1)
    const user = {
        username: 'gg',
        password: 'gg',
    } as authP.User;

    const signed = authP.signUser(user);
    const good = authP.verifyUser(signed);
    console.log(signed);
    console.log(good)
}

test();