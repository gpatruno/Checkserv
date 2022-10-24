import http = require('http');
import https = require('https');
import * as config from "config";
import * as ping from "ping";
import { IServer } from "../Interface";
import MailController = require("./MailController");

const mailCtrl = new MailController();
const mapAlive = new Map<string, boolean>();
const lServer: IServer[] = config.get("server");
lServer.forEach((element: IServer) => {
    mapAlive.set(element.host, true);
});

class ServerController {

    async pingServer(aServ: IServer) {
        let isAlive: boolean = await this.wrapedPing(aServ.host);
        this.changeState(aServ, isAlive);
    }

    async wgetServer(aServ: IServer) {
        let isAlive: boolean;
        switch (aServ.port) {
            case 443:
                isAlive = await this.wrapedHttps('https://' + aServ.host + '/');
                break;
            case 80:
            default:
                isAlive = await this.wrapedHttp('http://' + aServ.host + '/');
        }

        this.changeState(aServ, isAlive);
    }

    async wrapedHttps(url: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let data = ''
            https.get(url, res => {
                res.on('data', chunk => { data += chunk });
                res.on('end', () => {
                    resolve(true);
                });
                res.on('error', (err: Error) => {
                    console.log('error ', err);
                    resolve(false);
                });
            })
        });
    }

    async wrapedHttp(url: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let data = ''
            http.get(url, res => {
                res.on('data', chunk => { data += chunk });
                res.on('end', () => {
                    resolve(true);
                });
                res.on('error', (err: Error) => {
                    console.log('error ', err);
                    resolve(false);
                });
            })
        });
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

    changeState(aServ: IServer, isAlive: boolean) {
        if ((mapAlive.get(aServ.host) !== isAlive)) {
            console.log('Server change state: ' + isAlive);
            mapAlive.set(aServ.host, isAlive);
            mailCtrl.initMail(aServ, mapAlive.get(aServ.host));
        } else {
            console.log('Server don\'t change state still: ' + (isAlive) ? 'Alive' : 'Down');
        }
    }
}

export = ServerController;
