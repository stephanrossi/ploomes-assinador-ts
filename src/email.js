import * as Assinador from './assinador.js'

import { mailLogger } from './logger.js';

import imaps from 'imap-simple'
import { convert } from 'html-to-text';
import { READ_MAIL_CONFIG } from './config.js';

const readMail = async () => {
    try {
        const connection = await imaps.connect(READ_MAIL_CONFIG);

        mailLogger.info('CONNECTION SUCCESSFUL.')

        const box = await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };
        const results = await connection.search(searchCriteria, fetchOptions);

        if (results.length === 0) {
            mailLogger.info('No unread messages were found.')
            connection.end();
            return false;
        }

        results.forEach((res) => {
            const text = res.parts.filter((part) => {
                return part.which === 'TEXT';
            });
            let emailHTML = text[0].body;
            let emailText = convert(emailHTML);

            let obj = {};
            emailText.split('\n').forEach(v => v.replace(/\s*(.*)\s*:\s*(.*)\s*/, (s, key, val) => {
                obj[key] = isNaN(val) || val.length < 1 ? val || undefined : Number(val);
            }));

            let contractId = parseInt(obj.id_contrato)
            let clientName = obj.Cliente.toUpperCase()
            let proposeId = parseInt(obj.Proposta_codigo)

            Assinador.createDocument(contractId, clientName, proposeId)
        });
        connection.end();
    } catch (error) {
        mailLogger.error(`readMail: ${error}`)
        return false;
    }
};

readMail()