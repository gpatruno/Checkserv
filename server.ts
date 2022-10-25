// Configuration des Loggers
import * as LoggerManager from "./lib/config/Logger";
const Logger = LoggerManager(__filename);

Logger.info('AlertByMail: SERVICE STARTED at ' + new Date().toLocaleString());

import CronController = require("./lib/controller/CronController");
const cronCtrl = new CronController();

import * as config from "config";
if (config.has('APP.SHORT_CRON') && config.get('APP.SHORT_CRON')) {
    cronCtrl.shortPulse();
}
if (config.has('APP.LONG_CRON') && config.get('APP.LONG_CRON')) {
    cronCtrl.longPulse();
}
if (config.has('APP.CUSTOM_CRON') && config.get('APP.CUSTOM_CRON') !== undefined && config.get('APP.CUSTOM_CRON') !== null) {
    cronCtrl.customPulse();
}

