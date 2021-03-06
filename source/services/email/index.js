const nodemailer = require('nodemailer');

const {
    config: { MAIL, PASSWORD_TO_MAIL, TYPE_OF_MAIL },
    name_enums: { LOCALHOST, NO_REPLY }
} = require('../../configs');
const { Error_handler } = require('../../errors/error_handler');

const transporter = nodemailer.createTransport({
    service: TYPE_OF_MAIL,
    auth: {
        pass: PASSWORD_TO_MAIL,
        user: MAIL,
    },
    host: LOCALHOST,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
});

const email_sender = (user_email, payload, info) => {
    try {
        return transporter.sendMail({
            from: NO_REPLY,
            to: user_email,
            subject: payload.type_of_action,
            text: `${payload.text} ${info.custom_url}`
        });
    } catch (e) {
        throw new Error_handler(e.message, e.code);
    }
};

module.exports = {
    email_sender
};
