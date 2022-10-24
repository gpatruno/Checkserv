import * as express from 'express';
import http = require('http');
import * as config from 'config';
import UserAgent = require('express-useragent');
import { Application, Request, Response } from 'express';
import MailController = require('./lib/controller/MailController'); 

var bodyParser = require('body-parser');

const app: Application = express();
const userAgent = UserAgent;
const mailCtrl = new MailController();

// Connfiguration des Loggers
import * as LoggerManager from './lib/config/Logger';
const Logger = LoggerManager(__filename);

mailCtrl.sendMail('Le serveur est DOWN', 'mira-ceti.ovh');

/**
 * @apiHeader {String} Access-Control-Allow-Origin *
 */
app.use(userAgent.express());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(function (req: any, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

// Route qui vérifie que l'appli est toujours connecté
app.get('/', (req: Request, res: Response) => {
    res.send('[' + process.env.NODE_ENV + '] - Welcome to AlertByMail API - Deploy at : ' + new Date().toISOString());
});
// Route qui vérifie que l'appli est toujours connecté
app.get('/alive', (req: Request, res: Response) => {
    res.send({ sucess: true, message: 'I m Here don\'t worry' });
});

app.get('/test' , (req: Request, res: Response) => {
    mailCtrl.sendInitPwd("test email","gaetan.patruno@gmail.com");
    res.send({ sucess: true, message: 'I m Here don\'t worry' });
});

//Démarrage de l'API
const httpServer = http.createServer(app);

httpServer.listen(config.get('APP.PORT'), () => {
    Logger.info('INFO - AlertByMail [' + process.env.NODE_ENV + '] - API Started on port : ' + config.get('APP.PORT') + ' - Deploy at : ' + new Date());
    console.log('INFO - AlertByMail [' + process.env.NODE_ENV + '] - API Started on port : ' + config.get('APP.PORT') + ' - Deploy at : ' + new Date());
});

export = app;