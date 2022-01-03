async function auth({ getPrm, stdErrRsp }) {

    const username = getPrm('username');
    const password = getprm('password');

    const user = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: username },
        { name: 'password', value: password },
    ]);
    if (!user) {
        return stdErrRsp(`no user ${username}`);
    }

    console.log(user)

    const signed = authP.signUser(user);
    return signed;
}

module.exports = {
    auth,
}