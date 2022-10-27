import * as config from "config";
import * as LoggerManager from "../config/Logger";
import tcpPortUsed = require('tcp-port-used');
import { IServer, IService } from "../Interface";
import MailController = require("./MailController");

const Logger = LoggerManager(__filename);
const mailCtrl = new MailController();
const mServer = new Map<string, boolean>();
const mService = new Map<string, boolean>();
// Initialisation
const lServer: IServer[] = (config.has("server")) ? config.get("server") : [];
lServer.forEach((aServer: IServer) => {
    mServer.set(aServer.host, (aServer.defaultstate !== undefined) ? aServer.defaultstate : true);
    const lService: IService[] = (aServer.services) ? aServer.services : [];
    console.log('INIT SERVER: ' + aServer.host + ' - SERVICES: ' + lService.length);
    lService.forEach((aService: IService) => {
        mService.set(aServer.host + aService.port, (aService.defaultstate !== undefined) ? aService.defaultstate : true);
    });
});

class ServerController {

    async checkServer(aServer: IServer): Promise<void> {
        const servUp: boolean = await this.telnet((aServer.port) ? aServer.port : 22, aServer.host);
        console.log('GP checkServer: ' + aServer.host + ' ' + servUp);
        if ((mServer.get(aServer.host) !== servUp)) {
            this.serverChange(aServer, servUp);
        } else if (servUp) {
            // On check les services
            const lService: IService[] = (aServer.services) ? aServer.services : [];
            lService.forEach(async (aService: IService) => {
                this.checkService(aService, aServer);
            });
        } else {
            // Serv injoinable et ce n'est pas nouveau
        }
    }

    async checkService(aService: IService, aServer: IServer): Promise<void> {
        const servUp: boolean = await this.telnet(aService.port, aServer.host);
        console.log('GP checkService: ' + aServer.host + ':' + aService.port + ' ' + servUp);
        if ((mService.get(aServer.host + aService.port) !== servUp)) {
            this.serviceChange(aService, aServer, servUp);
        } else {
            // Service injoinable et ce n'est pas nouveau
        }
    }

    async telnet(port: number, host: string): Promise<boolean> {
        return await new Promise((resolve, reject) => {
            tcpPortUsed.check(port, host)
                .then(function (inUse: string) {
                    resolve(true);
                }, function (err: { message: any; }) {
                    console.log(err);
                    resolve(false);
                });
        });
    }

    serverChange(aServer: IServer, servUp: boolean): void {
        Logger.info('--->[' + aServer.name + '] WARNING: Server change state: ' + servUp);
        mServer.set(aServer.host, servUp);
        mailCtrl.alertServer(aServer, mServer.get(aServer.host));
    }

    serviceChange(aService: IService, aServer: IServer, servUp: boolean): void {
        Logger.info('--->[' + aServer.host + ':' + aService.port + '] WARNING: Server change state: ' + servUp);
        mService.set(aServer.host + aService.port, servUp);
        // mailCtrl.initMail(aServ, mServer.get(aServ.host));
    }

    testConf(aServ: IServer) {
        mailCtrl.initMail(aServ, true);
    }
}

export = ServerController;
