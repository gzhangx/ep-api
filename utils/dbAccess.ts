import { updateData, updateDataByObject, getOneByNameValuePairs, addData } from './db';
import { User } from './authProvider';

export const UserTableName: string = 'loginClient';
export async function updateUser(id: string, user: object) {
    return await updateDataByObject(UserTableName, id, user);
}

export async function createUser(user: object) {
    return await addData(UserTableName, user);
}

export async function findUserByUserName(username: string): Promise<User> {
    const user = await getOneByNameValuePairs(UserTableName, [
        { name: 'username', value: username },
        //{ name: 'password', value: password },
    ]) as User;
    return user;
}