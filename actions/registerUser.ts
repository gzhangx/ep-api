import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as uuid from 'uuid';
import * as awsEmail from '../utils/awsEmail';

export async function registerUser(event: any) {
    const { username } = event;

    const user = await db.getOneByNameValuePairs('loginClients', [
        { name: 'username', value: (username||'').toLowerCase() },
    ]) as authP.User;
    if (user) {
        return { error: `user ${username} exists` };
    }

    const id = uuid.v1();
    const password = id.substr(0, 5);
    const userSave = {
        id,
        username: username.toLowerCase(),
        password: authP.getPwdHash(password),
        provider: 'local',
        created: new Date().toISOString(),
        verified: false,
        active: true,
    };
    await db.addData('loginClients', userSave);

    const html = `Dear ${username}, your temp password is ${password}`;
    const emailData: awsEmail.EmailData = {
        ToAddresses: [username],
        CcAddresses: null,
        html,
        text: html,
        subject: `Dear ${username}, your temp password is ${password}`,
        Source: process.env.FROM_EMAIL,
    };
    await awsEmail.sendEmail(emailData);
    return {
        id:userSave.id,
    };
}


