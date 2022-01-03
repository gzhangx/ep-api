const db = require('../utils/db');
const authP = require('../utils/authProvider');
async function auth(event) {

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

module.exports = {
    auth,
}