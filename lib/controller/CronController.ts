import * as cron from "node-cron";
import * as config from "config";
import { IServer } from "../Interface";
import ServerController = require("./ServerController");

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
// */2 * * * *  = Every 2 minutes

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
        cron.schedule("* * * 5 *", () => {
            console.log('customPulse: ' + new Date().toLocaleString());
            this.pulseServer();
        }).start;
    }

    pulseServer() {
        for (let index: number = 0; index < lServer.length; index++) {
            const aServ: IServer = lServer[index];
            console.log(' method: ' + aServ.method + ' server: ' + aServ.name);
            switch (aServ.method) {
                case "wget":
                case "http":
                case "https":
                    servCtrl.wgetServer(aServ);
                    break;
                case "ping":
                default:
                    servCtrl.pingServer(aServ);
            }
        }
    }
}

export = CronController;
