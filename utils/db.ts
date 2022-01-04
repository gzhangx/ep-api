import { AWS } from './awsSetup';
const docClient = new AWS.DynamoDB.DocumentClient();

export function getAll(params, onData: (err, data) => void)
{
    const onScan = (err, data) => {
        if (err) {
            onData(err, null);
        } else {
            onData(err, data); //data.items            
            // continue scanning if we have more items
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    };
    return docClient.scan(params, onScan)
}


export function getAllByTable(TableName: string, FilterExpression: string, ExpressionAttributeValues: object, onData: (err: any, data: any) => void)
{
    getAll({
        TableName,
        FilterExpression,
        ExpressionAttributeValues,
    }, onData);
}

export async function getOneByName(TableName: string, name: string, value: string | number): Promise<object> {
    return new Promise((resolve, reject) => getAll({
        TableName,
        FilterExpression: `${name}=:name`,
        ExpressionAttributeValues: {
            ':name': value
        },
    }, (err, data) => {
        if (err) reject(err);
        else resolve(data.Items[0]);
    }));
}

export type DbQueryParams = {
    name: string;
    value: string | number;
}
export async function getOneByNameValuePairs(TableName: string, pairs: DbQueryParams[]): Promise<object> {
    return new Promise((resolve, reject) => getAll({
        TableName,
        FilterExpression: pairs.map(p => `${p.name}=:${p.name}`).join(' and '),
        ExpressionAttributeValues: pairs.reduce((acc, p) => {
            acc[`:${p.name}`] = p.value;
            return acc;
        }, {}),
    }, (err, data) => {
        if (err) reject(err);
        else resolve(data.Items[0]);
    }));
}

export async function addData(TableName: string, Item: object): Promise<object> {
    return await docClient.put({
        TableName,
        Item
    }).promise();
}

export async function updateData(TableName: string, id: string,
    UpdateExpression: string,
    ExpressionAttributeValues: object
): Promise<object>{
    return await docClient.update({
        TableName,
        Key: { id },
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
    }).promise();
}

export async function updateDataByObject(tableName: string, id: string, data: object)
    : Promise<object> {
    const keys = Object.keys(data);
    const updateFilters = keys.map(k=>`${k}=:${k}`)
    const UpdateExpression: string = `set ${updateFilters.join(',')}`;
    const ExpressionAttributeValues = keys.reduce((acc, k) => {
        acc[`:${k}`] = data[k];
        return acc;
    }, {});
    return updateData(tableName, id, UpdateExpression, ExpressionAttributeValues);
}

export async function deleteData(TableName: string, id: string): Promise<object> {
    return await docClient.delete({
        TableName,
        Key: { id },
    }).promise();
}

async function test() {

    /* await addData('loginClients', {
        id: '1',
        username: 'gg',
        password: 'zz',
        created: new Date(),
        provider: 'local'
    });
    */
    
    const names = await getOneByNameValuePairs('loginClients', [
        { name: 'username', value: 'gg' },
        {name:'password', value:'zz'}
    ])
    return console.log(names);
    const customerTable = 'CustomerUser-kh7dnrwmljerze6banc6qglajq-staging';
    const addres = await addData(customerTable, {
        id: 'test1',
        email: 'gg@zz.com',
        phone: '411111111',
        name: 'gg',
    });
    console.log(addres);
    const updateRes = await updateData(customerTable,
        'test1', 'set email=:email', {
        ":email": 'newemail'
    });
    console.log(updateRes);
    const delres = await deleteData(customerTable, 'test1');
    console.log('deleted');
    console.log(delres);
    await getAllByTable(customerTable, null, null, (err, data) => {
        if (err) {
            console.log('error');
            console.log(err);
        } else {
            console.log('data for cust')
            console.log(data);
        }
    });

    await getAllByTable('BusinessUser-kh7dnrwmljerze6banc6qglajq-staging',
        'username=:usr', {
        ':usr': 'ericktest6'
    }, (err, data) => {
        if (err) {
            console.log('errr');
            console.log(err);
        } else {
            console.log('data for bus user');
            console.log(data);
        }
    });

    const getoneres = await getOneByName('BusinessUser-kh7dnrwmljerze6banc6qglajq-staging', 'username', 'ericktest6');
    console.log('getoneres');
    console.log(getoneres);
}
