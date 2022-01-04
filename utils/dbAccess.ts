import { updateData, updateDataByObject } from './db';
import { User } from './authProvider';

export const UserTableName: string = 'loginClients';
export async function saveUser(id: string, user: object) {
    return await updateDataByObject(UserTableName, id, user);
}