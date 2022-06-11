import dotenv from 'dotenv'

dotenv.config()

export const READ_MAIL_CONFIG = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        port: 993,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    },
};

export const SEND_MAIL_CONFIG = {
    service: process.env.EMAIL_SERVVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};