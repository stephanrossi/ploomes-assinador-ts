import * as Assinador from './assinador.js'


import imaps from 'imap-simple'
import { convert } from 'html-to-text';
import { READ_MAIL_CONFIG } from './config.js';

const readMail = async () => {
    try {
        const connection = await imaps.connect(READ_MAIL_CONFIG);
        console.log('CONNECTION SUCCESSFUL', new Date().toString());
        const box = await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };
        const results = await connection.search(searchCriteria, fetchOptions);
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
            let idContrato = parseInt(obj.id_contrato)

            Assinador.createDocument(idContrato)
        });
        connection.end();
    } catch (error) {
        console.log(error);
    }
};

setInterval(readMail(), 60000)
// export default readMail