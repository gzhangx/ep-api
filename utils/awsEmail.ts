import { AWS } from './awsSetup';

//AWS.config.update({ region: 'us-east-2' });

export interface EmailData {
    ToAddresses: string[];
    CcAddresses: string[];
    html: string;
    text: string;
    subject: string;
    Source: string;
    //ReplyToAddresses: string[];
}

export async function sendEmail(data: EmailData) {
    const { CcAddresses, ToAddresses, Source, html, text, subject } = data;
    // Create sendEmail params 
    const params = {
        Destination: { // required 
            CcAddresses,
            ToAddresses,
        },
        Message: { // required 
            Body: { // required 
                Html: {
                    Charset: "UTF-8",
                    Data: html,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: text,
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            }
        },
        Source, /* required */
        ReplyToAddresses: (data as any).ReplayToAddress,
    };
    const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    return await sendPromise.then(data => {
        console.log(data);
        return data;
    }).catch(err => {
        console.log(data);
        return err;
    });
}