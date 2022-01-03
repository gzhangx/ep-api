const actions = require('./actions/index');


exports.handler = async function (event) {
    console.log('login check hit');
 
    const { action } = event;
    const func = action && actions[action];
    if (func) {        
        return await func(event);
    }
    
    console.log(`unknown action ${action}`);
    return {        
        error: `unknown action ${action}`,
    };
}