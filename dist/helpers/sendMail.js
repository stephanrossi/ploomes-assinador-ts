"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendingEmail = void 0;
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// initialize nodemailer
var transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_SMTP,
    port: process.env.EMAIL_SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path_1.default.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path_1.default.resolve('./views/'),
};
// use a template file with nodemailer
transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
// trigger the sending of the E-mail
async function sendingEmail(personName) {
    try {
        var mailOptions = {
            from: '"Teste DIN" <testedin@previsa.com.br>',
            to: 'stephan@previsa.com.br;leonardopereira@previsa.com.br',
            // to: 'stephan@previsa.com.br;cleiciamonteiro@previsa.com.br;juniormonteiro@previsa.com.br;leonardopereira@previsa.com.br', // list of receivers
            subject: 'Alerta - Assinador Previsa',
            template: 'email',
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
    }
    catch (error) {
        console.log(error);
    }
}
exports.sendingEmail = sendingEmail;
