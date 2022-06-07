export const READ_MAIL_CONFIG = {
    imap: {
        user: 'testedin@previsa.com.br',
        password: 'p4Agard@',
        host: 'outlook.office365.com',
        port: 993,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    },
};

export const SEND_MAIL_CONFIG = {
    service: 'outlook',
    auth: {
        user: 'testedin@previsa.com.br',
        pass: 'p4Agard@',
    },
};