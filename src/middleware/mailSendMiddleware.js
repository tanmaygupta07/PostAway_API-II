import nodemailer from 'nodemailer';

const sendMail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    //sending email
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "OTP to Reset Password",
        text: `Your OTP is ${otp}. Please use it to reset your password. The OTP is valid for next 5 minutes.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail;