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
                    Logger.info(aServ.host + ' -Port ' + aServ.port + ' usage: ' + inUse);
                    resolve(true);
                }, function (err: { message: any; }) {
                    Logger.error('Error on check:', err.message);
                    resolve(false);
                });
        });
        this.changeState(aServ, isAlive);
    }

    changeState(aServ: IServer, isAlive: boolean) {
        if ((mapAlive.get(aServ.host) !== isAlive)) {
            Logger.info(aServ.name + ' - Server change state: ' + isAlive);
            mapAlive.set(aServ.host, isAlive);
            mailCtrl.initMail(aServ, mapAlive.get(aServ.host));
        } else {
            Logger.info(aServ.name + ' don\'t change state still: ' + ((isAlive) ? 'Alive' : 'Down'));
        }
    }

    testConf(aServ: IServer) {
        mailCtrl.initMail(aServ, true);
    }
}

export = ServerController;
