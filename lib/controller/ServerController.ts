import * as config from "config";
import * as ping from "ping";
import * as LoggerManager from "../config/Logger";
import tcpPortUsed = require('tcp-port-used');
import { IServer } from "../Interface";
import MailController = require("./MailController");

const Logger = LoggerManager(__filename);
const mailCtrl = new MailController();
const mapAlive = new Map<string, boolean>();
const lServer: IServer[] = config.get("server");
lServer.forEach((aServ: IServer) => {
    mapAlive.set(aServ.host, true);
});

class ServerController {

    async pingServer(aServ: IServer) {
        let isAlive: boolean = await this.wrapedPing(aServ.host);
        Logger.info('PING [' + aServ.name + '] isAlive: ' + isAlive);
        this.changeState(aServ, isAlive);
    }

    async wrapedPing(url: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            ping.sys.probe(url, function (isAlive: boolean) {
                if (isAlive) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async telnet(aServ: IServer) {
        let isAlive: boolean = await new Promise((resolve, reject) => {
            tcpPortUsed.check(aServ.port, aServ.host)
                .then(function (inUse: string) {
                    Logger.info('TCP [' + aServ.name + '] port: ' + aServ.port + ' isAlive: ' + inUse);
                    resolve(true);
                }, function (err: { message: any; }) {
                    Logger.error('TCP [' + aServ.name + '] Error on check port: ' + aServ.port, err);
                    resolve(false);
                });
        });
        this.changeState(aServ, isAlive);
    }

    changeState(aServ: IServer, isAlive: boolean) {
        if ((mapAlive.get(aServ.host) !== isAlive)) {
            Logger.info('--->[' + aServ.name + '] WARNING: Server change state: ' + isAlive);
            mapAlive.set(aServ.host, isAlive);
            mailCtrl.initMail(aServ, mapAlive.get(aServ.host));
        } else {
            Logger.info('--->[' + aServ.name + '] state don\'t change still: ' + ((isAlive) ? 'UP' : 'DOWN'));
        }
    }

    testConf(aServ: IServer) {
        mailCtrl.initMail(aServ, true);
    }
}

export = ServerController;
