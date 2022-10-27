import * as nodemailer from "nodemailer";
import fs = require("fs");
import * as path from "path";
import * as config from "config";
import * as LoggerManager from "../config/Logger";
import { ISender, IServer, IService, IUser } from "../Interface";

const Logger = LoggerManager(__filename);
const mailConf: ISender = config.get("SENDER");
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

    async alertServer(server: IServer, state: boolean) {
        const title = (state) ? 'Le serveur est UP' : 'Le serveur est DOWN';
        const mailOptions = {
            from: mailConf.EMAIL,
            to: this.getUserMail(),
            subject: "[" + server.name + "] " + title + " à " + new Date().toLocaleString(),
            html: this.initTemplate(server.host, server.port, state)
        };
        this.sendMail(mailOptions);
    }

    async alertService(service: IService, server: IServer, state: boolean) {
        const title = (state) ? 'Le service ' + service.name + ' est de nouveau UP' : 'Le service ' + service.name + ' est DOWN';
        const mailOptions = {
            from: mailConf.EMAIL,
            to: this.getUserMail(),
            subject: "[" + service.name + "] " + title + " à " + new Date().toLocaleString(),
            html: this.initTemplate(server.host, service.port, state, service.name)
        };
        this.sendMail(mailOptions);
    }

    getUserMail(): string[] {
        const listTO: IUser[] = config.get("user");
        let lToSend: string[] = [];
        listTO.forEach((aUser: IUser) => {
            lToSend.push(aUser.email);
        });
        return lToSend;
    }

    initTemplate(host: string, port: number, state: boolean, service?: string): string {
        let result = '';
        try {
            let pathToTemplate = path.resolve("./") + path.join("/", "templates", "MailStateChange.html");
            const tmpMailInit = fs.readFileSync(pathToTemplate, {
                encoding: "utf8",
                flag: "r",
            });

            let template: string = tmpMailInit.replace("$$datetime$$", new Date().toLocaleString());
            template = template.replace("$$host$$", host);
            template = template.replace("$$state$$", (state) ? 'UP' : 'DOWN');
        } catch (error) {
            Logger.error('ERROR initTemplate: ', error);
        }
        return result;
    }

    testMail(server: IServer, state: boolean): void {
        const title = 'Hello Worl - Test Mail from CheckServ';
        const mailOptions = {
            from: mailConf.EMAIL,
            to: this.getUserMail(),
            subject: "[" + server.name + "] " + title + " à " + new Date().toLocaleString(),
            html: this.initTemplate(server.host, server.port, state, server.name),
        };
        this.sendMail(mailOptions);
    }

    async sendMail(options: any): Promise<boolean> {
        let result = false;
        try {
            result = await this.wrapedSendMail(options);
        } catch (error) {
            Logger.error('ERROR sendMail: ', error);
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
                    Logger.error('ERROR wrapedSendMail: ', error);
                    resolve(false);
                } else {
                    Logger.info("Email sent: " + info.response);
                    resolve(true);
                }
            });
        });
    }
}

export = MailController;
