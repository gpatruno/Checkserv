import * as nodemailer from "nodemailer";
import fs = require("fs");
import * as path from "path";
import * as config from "config";

import { IConfig, ISender, IUser } from "../Interface";
const mailConf: ISender = config.get("sender");

const transporter = nodemailer.createTransport({
    host: mailConf.HOST,
    port: mailConf.PORT_EMAIL,
    secure: true,
    auth: {
        user: mailConf.EMAIL,           // adresse mail
        pass: mailConf.EMAIL_PASSWORD, // password
    },
    tls: {
        // If you know that the host does not have a valid certificate you can allow it in the transport settings with tls.rejectUnauthorized option:
        rejectUnauthorized: false,
    },
});

const mailOptions = {
    from: mailConf.EMAIL,
    to: undefined,
    subject: "",
    html: "",
};

class MailController {

    /**
     * sendMail
     *
     */
    async sendMail(title: string, server: string) {
        const listTO: IUser[] = config.get("user");
        let To: string[] = [];
        for (let index: number = 0; index < listTO.length; index++) {
            const element: IUser = listTO[index];
            To.push(element.email);
        }
        mailOptions.to = To;
        mailOptions.subject = "[" + server + "] " + title + " à " + new Date().toISOString();
        console.log(mailOptions);
    }

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
        mailOptions.subject = "Initialisation du mot de passe";
        try {
            let pathToTemplate = path.resolve("./") + path.join("/", "templates", "MailStateChange.html");
            const tmpMailInit = fs.readFileSync(pathToTemplate, {
                encoding: "utf8",
                flag: "r",
            });

            let template: string = tmpMailInit.replace("$$username$$", fullname);
            template = template.replace("$$identifiant$$", fullname);
            mailOptions.html = template;

            result = await this.wrapedSendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }

        return result;
    }

    /**
     * wrapedSendMail
     * Permet de rendre la fonction sendMail async
     *
     * @param mailOptions
     * @returns Promise<boolean>
     */
    async wrapedSendMail(mailOptions: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }): Promise<boolean> {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error: Error, info: { response: string }) {
                if (error) {
                    console.error("GP ERROr", error);
                    resolve(false); // or use rejcet(false) but then you will have to handle errors
                } else {
                    console.log("Email sent: " + info.response);
                    resolve(true);
                }
            });
        });
    }
}

export = MailController;
