import { transports, createLogger, format } from 'winston';
import * as path from 'path';
import fs = require('fs');
import config = require("config");

if (config.has('APP.CLEAR_LOG') && config.get('APP.CLEAR_LOG') === true) {
    try {
        fs.truncate('./logs/default.log', 0, function () { console.log('Default log clear !') });
        fs.truncate('./logs/error.log', 0, function () { console.log('Error log clear !') });
    } catch (error) {
        console.error('Something goes wrong for clear Log : ', error);
    }
}

/**
 * Output Info Logger
 */
const logFormat = format.combine(
    //format.colorize(),
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level} ${info.component}: ${info.message}`)
);
/**
 * Output Error Logger
 */
const formatError = format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level} ${info.component}: ${info.message} ${info.stack}`),
    format.align(),
);

const LoggerManager = (moduleName: string) => createLogger({
    exitOnError: false,
    defaultMeta: { component: path.basename(moduleName) },
    transports: [
        new transports.Console(),
        new transports.File({
            filename: './logs/default.log',
            level: 'info',
            format: logFormat
        }),
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: formatError,
        })
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({ format: formatError, filename: './logs/error.log' })
    ],
    rejectionHandlers: [
        new transports.Console(),
        new transports.File({ format: formatError, filename: './logs/error.log' })
    ]
});

export = LoggerManager;