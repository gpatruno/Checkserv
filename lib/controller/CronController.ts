import * as cron from "node-cron";
import * as config from "config";

import { IServer } from "../Interface";
const mailConf: IServer = config.get("server");

console.log("CRON CONTROLLER STARTED AT " + new Date().toLocaleString());
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

let isAlive = true;
class CronController {
    
    shortPulse() {
        cron.schedule("*/5 * * * *", () => {
            console.log(new Date().toLocaleString());
        }).start;
    }

    longPulse() {
        cron.schedule("* 1 * * *", () => {
            console.log(new Date().toLocaleString());
        }).start;
    }
}

export = CronController;
