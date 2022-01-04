const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
export function getAws() {
    return AWS;
}