import * as db from '../utils/db';
import * as authP from '../utils/authProvider';
import * as uuid from 'uuid';
import * as googleEmail from '../utils/googleMail';
import * as dbAccess from '../utils/dbAccess';
export async function registerUser(event: any) {
    const { username } = event;
    try {
        console.log('reguster user')
        const user = await dbAccess.findUserByUserName((username || '').toLowerCase());            
        if (user) {
            console.log('reguster user-> found user')
            return { error: `user ${username} exists` };
        }

        console.log('reguster user continue')

        const id = uuid.v1();
        const password = id.substr(0, 5);
        console.log('reguster user continue ' + id)
        const userSave = {
            id,
            username: username.toLowerCase(),
            password: authP.getPwdHash(password),
            provider: 'local',
            created: new Date().toISOString(),
            verified: false,
            active: true,
        };
        console.log('adding data ' + id)
        await dbAccess.createUser(userSave);

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


