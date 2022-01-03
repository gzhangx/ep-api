const db = require('./utils/db');
const authP = require('./utils/authProvider');

async function test() {
    const user = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: 'gg' },
        { name: 'password', value: 'zz' }
    ])

    console.log(user)

    const signed = authP.signUser(user);
    const good = authP.verifyUser(signed);
    console.log(signed);
    console.log(good)
}

test();