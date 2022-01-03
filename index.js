const actions = require('./actions/index');

function parseRowBody(rawStr) {
    if (rawStr && typeof rawStr === 'string') {
        const parts = rawStr.split('&');
        return parts.reduce((acc, prt) => {
            const nameVal = prt.split('=');
            let val = nameVal[1];
            if (val !== undefined || val !== null) val = decodeURIComponent(val);
            acc[decodeURIComponent(nameVal[0])] = val;
            return acc;
        }, {});
    }
    return {};
}
module.exports = async function (context, req) {
    context.log('login check hit');

    const rawBody = parseRowBody(req.rawBody);
    console.log(rawBody);    
    const getPrm = name => req.query[name] || (req.body && req.body[name]) || rawBody[name];
    const actionStr = getPrm('action');
    const stdErrRsp = error => {
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
                'content-type': 'application/json; charset=utf-8'
            },
            body: {
                error,
            },
        };
    }
    if (actionStr && actions[actionStr]) {
        
        return await actions[actionStr]({ context, getPrm, stdErrRsp });
    }

    
    console.log(`unknown action ${actionStr}`);
    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: {
            error: `unknown action ${actionStr}`,
        },
    };
}