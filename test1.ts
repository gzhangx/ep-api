import * as authP from './utils/authProvider';

function test() {
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