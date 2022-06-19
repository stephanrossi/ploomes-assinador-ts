"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ploomesLogger = exports.signerLogger = exports.mailLogger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, json } = winston_1.format;
exports.mailLogger = (0, winston_1.createLogger)({
    format: combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'mail.log', level: 'info', dirname: 'logs' })
    ]
});
exports.signerLogger = (0, winston_1.createLogger)({
    format: combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'signer.log', level: 'info', dirname: 'logs' })
    ],
});
exports.ploomesLogger = (0, winston_1.createLogger)({
    format: combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'ploomes.log', level: 'info', dirname: 'logs' })
    ]
});
