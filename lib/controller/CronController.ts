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
// 5 */4 * * *  = At minute 5 past every 4th hour
class CronController {

    shortPulse() {
        Logger.info('CRON: SHORT ACTIVE');
        cron.schedule("*/5 * * * *", () => {
            Logger.info('shortPulse: ' + new Date().toLocaleString());
            this.pulseServer();
        }).start;
    }

    longPulse() {
        cron.schedule("5 */4 * * *", () => {
            Logger.info('CRON: LONG ACTIVE');
            Logger.info('longPulse: ' + new Date().toLocaleString());
            this.pulseServer();
        }).start;
    }

    customPulse() {
        if (cron.validate(config.get('APP.CUSTOM_CRON'))) {
            Logger.info('CRON: CUSTOM ACTIVE');
            cron.schedule(config.get('APP.CUSTOM_CRON'), () => {
                Logger.info('customPulse: ' + new Date().toLocaleString());
                this.pulseServer();
            }).start;
        } else {
            if (config.get('APP.CUSTOM_CRON') === "TEST_MAIL") {
                Logger.info('TEST MAIL CONFIGURATION !');
                const testService: IServer = {
                    name: "Test Mail",
                    host: "test.mail.hostname",
                    port: 0
                }
                servCtrl.testConf(testService);
            } else {
                Logger.error('Invalid cron format: ' + config.get('APP.CUSTOM_CRON'));
            }
        }
    }

    pulseServer() {
        lServer.forEach((aServer: IServer) => {
            const method = "telnet";
            switch (method) {
                case "telnet":
                default:
                    servCtrl.checkServer(aServer);
            }
        });
    }
}

export = CronController;
