declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SIGNER_KEY: string;
            PLOOMES_KEY: string;
            EMAIL_USER: string;
            EMAIL_PASSWORD: string;
            EMAIL_HOST: string;
            EMAIL_SMTP_PORT: number;
            EMAIL_IMAP_PORT: number;
            EMAIL_SERVICE: string
        }
    }
}

export { }