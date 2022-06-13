import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config()

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_SMTP_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

// trigger the sending of the E-mail
export async function sendingEmail(personName) {
    try {
        var mailOptions = {
            from: '"Teste DIN" <testedin@previsa.com.br>', // sender address
            to: 'stephan@previsa.com.br;leonardopereira@previsa.com.br', // list of receivers
            // to: 'stephan@previsa.com.br;cleiciamonteiro@previsa.com.br;juniormonteiro@previsa.com.br;leonardopereira@previsa.com.br', // list of receivers
            subject: 'Alerta - Assinador Previsa',
            template: 'email', // the name of the template file i.e email.handlebars
            context: {
                personName
            }
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    } catch (error) {
        console.log(error);
    }

}