const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const TRANSPORTER = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'russel44@ethereal.email',
            pass: 'KZVFa1DHzPbqGZVCKm'
        }
});

module.exports = TRANSPORTER;