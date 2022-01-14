import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as uuid from 'uuid';
import * as googleEmail from '../utils/googleMail';

export async function registerUser(event: any) {
    const { username } = event;
    try {
        const user = await db.getOneByNameValuePairs('loginClients', [
            { name: 'username', value: (username || '').toLowerCase() },
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

        const subject = `Your login`;
        const text = `Dear ${username}, your temp password is ${password}`;
        console.log(`sending email`);
    
        await googleEmail.sendGoogleMail(username, subject, text);
        return {
            id: userSave.id,
        };
    } catch (err) {
        console.log(err);
        return {
            error: err.message
        }
    }
}


