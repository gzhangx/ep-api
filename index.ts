const actions = require('./actions/index');


exports.handler = async function (event) {
    console.log('login check hit');
 
    console.log(event);    
    if (event.requestContext.http.method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
    }

    const eventBody = JSON.parse(event.body);
    const { action } = eventBody;
    const func = action && actions[action];
    if (func) {        
        const result = await func(eventBody);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",                
            },
            body: JSON.stringify(result),
        };
    }
    
    console.log(`unknown action ${action}`);
    return {   
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({ error: `unknown action ${action}` }),
    };
}