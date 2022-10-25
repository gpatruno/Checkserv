import * as nodemailer from "nodemailer";
import fs = require("fs");
import * as path from "path";
import * as config from "config";

import { ISender, IServer, IUser } from "../Interface";
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



class MailController {

    async initMail(server: IServer, state: boolean) {
        const listTO: IUser[] = config.get("user");
        let lToSend: string[] = [];
        listTO.forEach((aUser: IUser) => {
            lToSend.push(aUser.email);
        });
        const title = (state) ? 'Le serveur est UP' : 'Le serveur est DOWN';
        const mailOptions = {
            from: mailConf.EMAIL,
            to: lToSend,
            subject: "[" + server.name + "] " + title + " à " + new Date().toLocaleString(),
            html: "",
        };
        this.sendMail(mailOptions, server, state);
    }

    async sendMail(options: any, server: IServer, state: boolean): Promise<boolean> {
        let result = false;

        try {
            let pathToTemplate = path.resolve("./") + path.join("/", "templates", "MailStateChange.html");
            const tmpMailInit = fs.readFileSync(pathToTemplate, {
                encoding: "utf8",
                flag: "r",
            });

            let template: string = tmpMailInit.replace("$$datetime$$", new Date().toLocaleString());
            template = template.replace("$$host$$", server.host);
            template = template.replace("$$state$$", (state) ? 'UP' : 'DOWN');
            options.html = template;

            result = await this.wrapedSendMail(options);
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
                    console.error("GP ERROR", error);
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
