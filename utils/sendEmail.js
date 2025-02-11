import nodemailer from 'nodemailer';

const email = "fakestoreapi2004@gmail.com";
const password = "lukaluka1234";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        console.log("Sending email...");
        await transporter.sendMail({
            from: email,
            to,
            subject,
            text
        });
    } catch(err) {
        throw err;
    }
};

export default sendEmail;