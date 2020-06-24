const sgMail = require('@sendgrid/mail')

// Storing 'from' email address onto variable
const from = 'dchumbley23@gmail.com'


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Basic sgMail.send({}) formatting
// sgMail.send({
//     to: 'dchumbley23@gmail.com',
//     from: 'dchumbley23@gmail.com',
//     subject: 'This is my first application email!',
//     text: 'I hope this actually works'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from,
        subject: 'Thanks for joining in!',
        text: `Welcome to the Task Manager App, ${name}. Let me know how you get along with the app!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from,
        subject: 'We hope to see you again!',
        text: `Hi ${name}. We extend our apologies in regards to your decision to leave us. Please contact us at ${from} to give us feed back on how we can improve our application experience in the future!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}