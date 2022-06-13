import { createLogger, format, transports, config } from 'winston'

const { combine, timestamp, json } = format

export const mailLogger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'mail.log', level: 'info', dirname: 'logs' })
    ]
})

export const signerLogger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'signer.log', level: 'info', dirname: 'logs' })
    ],

})

export const ploomesLogger = createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'ploomes.log', level: 'info', dirname: 'logs' })
    ]
})