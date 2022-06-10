import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'
import path from 'path'

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        host: "smtp.office365.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: "testedin@previsa.com.br",
            pass: "p4Agard@",
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
export async function sendEmail(personName) {
    var mailOptions = {
        from: '"Teste DIN" <testedin@previsa.com.br>', // sender address
        to: 'stephan@previsa.com.br', // list of receivers
        subject: 'Alerta Assinador Previsa',
        template: 'email', // the name of the template file i.e email.handlebars
        context: {
            // name: "Adebola", // replace {{name}} with Adebola
            // company: 'My Company', // replace {{company}} with My Company
            personName

        }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
sendEmail()