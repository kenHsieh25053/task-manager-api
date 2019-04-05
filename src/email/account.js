const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kw1984@livemail.tw',
        subject: 'Thank for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with this app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kw1984@livemail.tw',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}. Hope to see you soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}