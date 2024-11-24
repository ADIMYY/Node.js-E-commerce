const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
    //! 1] Create transporter
    console.log('starting send email');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_USER_PASSWORD,
        },
    });
    
    //! 2] Define some options (from, to, subject, email content)
    const mailOptions = {
        from : `E-shop App <${process.env.EMAIL_USERNAME}>`,
        to : options.to,
        subject: options.subject,
        text: options.text,
    }

    //! 3] Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;