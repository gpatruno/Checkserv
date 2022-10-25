import * as cron from "node-cron";
import * as config from "config";
import { IServer } from "../Interface";
import ServerController = require("./ServerController");
import * as LoggerManager from "../config/Logger";
const Logger = LoggerManager(__filename);

const lServer: IServer[] = config.get("server");
const servCtrl = new ServerController();

// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *  = Every minute
// */5 * * * *  = Every 5 minutes

class CronController {

    shortPulse() {
        cron.schedule("*/5 * * * *", () => {
            console.log('shortPulse: ' + new Date().toLocaleString());
            this.pulseServer();
        }).start;
    }

    longPulse() {
        cron.schedule("* 1 * * *", () => {
            console.log('longPulse: ' + new Date().toLocaleString());
            this.pulseServer();
        }).start;
    }

    customPulse() {
        if (cron.validate(config.get('APP.CUSTOM_CRON'))) {
            Logger.info('CRON: CUSTOM ACTIVE');
            cron.schedule(config.get('APP.CUSTOM_CRON'), () => {
                console.log('customPulse: ' + new Date().toLocaleString());
                this.pulseServer();
            }).start;
        } else {
            if (config.get('APP.CUSTOM_CRON') === "TEST_MAIL") {
                Logger.info('TEST MAIL CONFIGURATION !');
                const testService: IServer = {
                    name: "Test Mail",
                    host: "test.mail.hostname",
                    method: "MAIL",
                    port: 0
                }
                servCtrl.testConf(testService);
            } else {
                Logger.error('Invalid cron format: ' + config.get('APP.CUSTOM_CRON'));
            }
        }
    }

    pulseServer() {
        lServer.forEach((aServ: IServer) => {
            console.log(' method: ' + aServ.method + ' server: ' + aServ.name);
            switch (aServ.method) {
                case "ping":
                    servCtrl.pingServer(aServ);
                    break;
                case "telnet":
                case "wget":
                case "http":
                case "https":
                default:
                    servCtrl.telnet(aServ);
            }
        });
    }
}

export = CronController;
