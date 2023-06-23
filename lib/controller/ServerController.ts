import * as config from "config";
import * as LoggerManager from "../config/Logger";
import tcpPortUsed = require('tcp-port-used');
import { IServer, IService } from "../Interface";
import { MailController } from "./MailController";

const Logger = LoggerManager(__filename);
const mailCtrl = new MailController();
const mServer = new Map<string, boolean>();
const mService = new Map<string, boolean>();


class ServerController {
    lServer: IServer[] = [];

    constructor() {
        const lServerToUse: IServer[] = [];

        const lServerConf: IServer[] = (config.has("servers") && config.get("servers") !== undefined && config.get("servers") !== null) ? config.get("servers") : [];
        lServerConf.forEach((aServerConf: IServer) => {
            let servToUse: IServer = Object.assign({}, aServerConf);
            servToUse.defaultstate = (servToUse.defaultstate !== undefined && servToUse.defaultstate !== null) ? servToUse.defaultstate : true;
            servToUse.port = (servToUse.port) ? servToUse.port : 22, servToUse.host;
            mServer.set(servToUse.host, servToUse.defaultstate);
            
            const lService: IService[] = ((servToUse.services !== undefined && servToUse.services !== null) ? servToUse.services : []);
            lService.forEach((aService: IService) => {
                Logger.info('Name or port is not defined = ' + aService.port);
                if ((aService.name !== null && aService.name !== undefined) && (aService.port !== undefined && aService.port !== null)) {
                    lService.push(aService);
                    mService.set(servToUse.host + aService.port, (aService.defaultstate !== undefined && aService.defaultstate !== null) ? aService.defaultstate : true);
                } else {
                    Logger.info('REJECT SERVICE: Name or port is not defined = ' + aService.name + ':' + aService.port + ' | SERVER: ' + servToUse.name);
                }
            });
            servToUse.services = lService;

            lServerToUse.push(servToUse);
            Logger.info('INIT SERVER: ' + servToUse.host + ' - SERVICES: ' + lService.length + ' - STATE: ' + ((servToUse.defaultstate) ? 'UP' : 'DOWN'));
        });

        this.lServer = lServerToUse;
    }

    async checkServer(aServer: IServer): Promise<void> {
        const servUp: boolean = await this.telnet(aServer.port, aServer.host);
        if ((mServer.get(aServer.host) !== servUp)) {
            Logger.info('serverChange: ' + aServer.name + ' --> ' + servUp);
            this.serverChange(aServer, servUp);
        } else if (servUp) {
            // On check les services
            const lService: IService[] = (aServer.services) ? aServer.services : [];
            lService.forEach(async (aService: IService) => {
                this.checkService(aService, aServer);
            });
        } else {
            // Server injoinable et ce n'est pas nouveau
        }
    }

    async checkService(aService: IService, aServer: IServer): Promise<void> {
        const servUp: boolean = await this.telnet(aService.port, aServer.host);
        if ((mService.get(aServer.host + aService.port) !== servUp)) {
            Logger.info('serviceChange: ' + aService.name + ' --> ' + servUp);
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
                    Logger.info('[' + host + ':' + port + '] Connection failed: ' + err.message, err);
                    resolve(false);
                });
        });
    }

    serverChange(aServer: IServer, servUp: boolean): void {
        mServer.set(aServer.host, servUp);
        mailCtrl.alertServer(aServer, mServer.get(aServer.host));
    }

    serviceChange(aService: IService, aServer: IServer, servUp: boolean): void {
        mService.set(aServer.host + aService.port, servUp);
        mailCtrl.alertService(aService, aServer, servUp);
    }

    testConf(aServ: IServer) {
        mailCtrl.testMail(aServ, true);
    }
}

export = ServerController;
