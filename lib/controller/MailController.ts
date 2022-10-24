const nodemailer = require("nodemailer");
import fs = require('fs');
import * as path from 'path';
import * as config from 'config';

import { IConfig, ISender } from '../Interface';
let mailConf: ISender = config.get('sender');

const transporter = nodemailer.createTransport({
    host: mailConf.HOST,
    port: mailConf.PORT_EMAIL,
    secure: true, // true for 465, false for other ports
    auth: {
        user: mailConf.EMAIL, // adresse mail ovh
        pass: mailConf.EMAIL_PASSWORD // password ovh
    },
    tls: {
        rejectUnauthorized: false
        // If you know that the host does not have a valid certificate you can allow it in the transport settings with tls.rejectUnauthorized option:
    }
});

const mailOptions = {
    from: mailConf.EMAIL,
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
        mailOptions.to = email;
        mailOptions.subject = 'Initialisation du mot de passe';
        try {
            let pathToTemplate = path.resolve('./') + path.join('/', 'templates', 'MailError.html');
            const tmpMailInit = fs.readFileSync(pathToTemplate, { encoding: 'utf8', flag: 'r' });

            let template: string = tmpMailInit.replace('$$username$$', fullname);
            template = template.replace('$$identifiant$$', fullname);
            mailOptions.html = template;

            result = await this.wrapedSendMail(mailOptions);
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
            transporter.sendMail(mailOptions, function (error: string, info: { response: string; }) {
                if (error) {
                    console.error('GP ERROr', error);
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