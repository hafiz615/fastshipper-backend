const nodemailer = require('nodemailer');

require('dotenv').config()




const sendEmail = (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html: message,
    }

    transporter.sendMail(mailOptions)
}

//console.log(sendEmail('softhafizirshad@gmail.com', 'for muneeeb', 'how are you');
console.log(process.env.MAIL_HOST, 'hello')

module.exports = { sendEmail}