// Connfiguration des Loggers
import * as LoggerManager from "./lib/config/Logger";
const Logger = LoggerManager(__filename);


import CronController = require("./lib/controller/CronController");
import MailController = require("./lib/controller/MailController");
const cronCtrl = new CronController();
const mailCtrl = new MailController();

cronCtrl.shortPulse();

Logger.info('AlertByMail: SERVICE STARTED at ' + new Date().toLocaleString());
