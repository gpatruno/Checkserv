require("dotenv").config();
const nodemailer = require("nodemailer");
import fs = require('fs');
import * as path from 'path';

const transporterOVH = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT_EMAIL,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // adresse mail ovh
        pass: process.env.EMAIL_PASSWORD, // password ovh
    },
});

const mailOptionsOVH = {
    from: process.env.EMAIL,
    to: 'nomail',
    subject: '',
    html: ""
}

class MailController {

    /**
     * sendInitPsw
     * 
     * @param fullname string
     * @param email string
     * @param token string
     * @param login string
     */
    async sendInitPwd(fullname: string, email: string): Promise<boolean> {
        let result = false;
        mailOptionsOVH.to = email;
        mailOptionsOVH.subject = 'Initialisation du mot de passe';
        try {
            let pathToTemplate = path.resolve('./') + path.join('/', 'templates', 'mail', 'MailInitPassword.html');
            const tmpMailInit = fs.readFileSync(pathToTemplate, { encoding: 'utf8', flag: 'r' });

            let template: string = tmpMailInit.replace('$$username$$', fullname);
            template = template.replace('$$identifiant$$', fullname);
            mailOptionsOVH.html = template;

            result = await this.wrapedSendMail(mailOptionsOVH);
            return result;
        } catch (error) {
            console.log(error);
            return result;
        }
    }

    /**
     * wrapedSendMail
     * Permet de rendre la fonction sendMail async
     * 
     * @param mailOptions 
     * @returns Promise<boolean>
     */
    async wrapedSendMail(mailOptions: { from: string; to: string; subject: string; html: string; }): Promise<boolean> {
        return new Promise((resolve, reject) => {
            transporterOVH.sendMail(mailOptions, function (error: string, info: { response: string; }) {
                if (error) {
                    console.error(error);
                    resolve(false); // or use rejcet(false) but then you will have to handle errors
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                }
            });
        });
    }
}

export = MailController;