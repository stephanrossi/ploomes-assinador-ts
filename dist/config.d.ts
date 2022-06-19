export declare const READ_MAIL_CONFIG: {
    imap: {
        user: string;
        password: string;
        host: string;
        port: number;
        authTimeout: number;
        tls: boolean;
        tlsOptions: {
            rejectUnauthorized: boolean;
        };
    };
};
export declare const SEND_MAIL_CONFIG: {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
};
