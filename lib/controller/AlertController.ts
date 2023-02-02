import * as config from "config";
import * as LoggerManager from "../config/Logger";
import { IServer, IService } from "../Interface";
import { RequestInfo, RequestInit } from "node-fetch";
// const fetch = (url: RequestInfo, init?: RequestInit) => import('node-fetch').then(({ default: fetch }) => fetch(url, init));
import fetch from 'node-fetch';

class AlertController {

    async testRequest(): Promise<void> {
        try {
            await fetch('https://ntfy.sh/mytopicgptesttopic', {
                method: 'POST',
                body: 'Backup successful 😀'
            });
        } catch (error) {
            console.log(error);
        }

        // fetch('https://ntfy.sh/mytopicgptesttopic', {
        //     method: 'POST',
        //     body: 'Backup successful 😀'
        // }).then(response => {
        //     console.log(response);
        // }).catch(error => {
        //     console.log(error);
        // })
    }

}

export = AlertController;