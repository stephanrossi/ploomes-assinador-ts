import * as Assinador from './assinador.js'
import imaps from 'imap-simple'

import { mailLogger } from './helpers/logger.js';
import { sendingEmail } from './helpers/sendMail.js';

import { convert } from 'html-to-text';
import { READ_MAIL_CONFIG } from './config'

type EmailTypes = {
    Cliente: string;
    CPF_do_contato: string
    id_contrato: string
    Proposta_codigo: string
    contractId: string
}

const readMail = async () => {
    try {
        const connection = await imaps.connect(READ_MAIL_CONFIG);

        mailLogger.info('CONNECTION SUCCESSFUL.')

        const box = await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false,
        };
        const results = await connection.search(searchCriteria, fetchOptions);

        if (results.length === 0) {
            mailLogger.info('No unread messages were found.')
            connection.end();
            return false;
        }

        results.forEach(async (res) => {
            const text = res.parts.filter((part) => {
                return part.which === 'TEXT';
            });
            let emailHTML = text[0].body;
            let emailText = convert(emailHTML);

            let obj = {} as EmailTypes;

            emailText.split('\n').forEach(v => v.replace(/\s*(.*)\s*:\s*(.*)\s*/, (s, key: keyof EmailTypes, val): any => {
                obj[key] = isNaN(val) || val.length < 1 ? val || undefined : Number(val);
            }));

            let clientName = obj.Cliente.toUpperCase()
            let clientCPF = obj.CPF_do_contato
            let contractId = parseInt(obj.id_contrato)

            if (clientCPF == null || clientCPF == '' || clientCPF == undefined) {
                mailLogger.error(`readMail: CPF on contract ${contractId} is missing.`)
                await sendingEmail(clientName)
                return false;
            }

            let proposeId = parseInt(obj.Proposta_codigo)

            await Assinador.createDocument(contractId, clientName, proposeId)
        });
        connection.end();
    } catch (error) {
        mailLogger.error(`readMail: ${error}`)
        return false;
    }
};

readMail()