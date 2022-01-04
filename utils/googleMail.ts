// need env EMAIL_USER and EMAIL_PASS
const mailer = require('nodemailer');
export async function sendGoogleMail(to: string, subject: string, text: string) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const transporter = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user,
            pass,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    })


    const from = `${user}@gmail.com`;
    let message = {
        from, // listed in rfc822 message header
        to, // listed in rfc822 message header
        envelope: {
            from: `Daemon <${from}>`, // used as MAIL FROM: address for SMTP
            to // used as RCPT TO: address for SMTP
        },
        subject,
        text,
    }

    await transporter.sendMail(message)
    await transporter.close();
}