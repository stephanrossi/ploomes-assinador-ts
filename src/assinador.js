import * as Ploomes from './ploomes.js'
import pdf2base64 from 'pdf-to-base64'
import path from 'path'

import api from './api/assinador.js'
import { signerLogger } from './logger.js'

export async function getQuoteHash(quote) {
    let getQuoteInfo = await Ploomes.getQuoteDoc(quote)
    let getQuote = getQuoteInfo[0]
    let pdfPageCount = getQuoteInfo[1];

    let quoteParams = []

    let hash = ''

    let __dirname = path.resolve();

    try {
        hash = await pdf2base64(path.join(__dirname, getQuote))
    } catch (error) {
        console.log(error);
    }

    quoteParams.push(hash, pdfPageCount)

    return quoteParams

}

export async function uploadHash(quote) {
    let hashInfo = []

    let getHash = await getQuoteHash(quote)

    let hash = getHash[0]
    let pdfPageCount = getHash[1]

    let postHash = await api.post('/uploads/bytes', {
        "bytes": hash
    })

    let documentID = postHash.data.id

    hashInfo.push(documentID, pdfPageCount)

    return hashInfo

}

export async function createDocument(quote, clientName, proposeId) {
    let getDocInfo = await uploadHash(quote)
    let documentID = getDocInfo[0]
    let pdfPageCount = getDocInfo[1]

    let personData = await Ploomes.getPersonData(quote);

    let personName = personData[0];
    let personCPF = personData[1]
    let personEmail = personData[2]

    try {
        await api.post('/documents', {
            "files": [
                {
                    "displayName": `CONTRATO - ${clientName} - ${proposeId}`,
                    "id": documentID,
                    "name": `CONTRATO - ${clientName}.pdf`,
                    "contentType": "application/pdf"
                }
            ],
            "notifiedEmails": ["cleiciamonteiro@previsa.com.br"],
            "flowActions": [
                {
                    "type": "Signer",
                    "user": {
                        "name": personName,
                        "identifier": personCPF,
                        "email": personEmail
                    },
                    "allowElectronicSignature": true,
                    "prePositionedMarks": [
                        {
                            "type": "SignatureVisualRepresentation",
                            "uploadId": documentID,
                            "topLeftX": 150,
                            "topLeftY": 660,
                            "width": 200,
                            "pageNumber": pdfPageCount
                        },
                    ]
                },
                {
                    "type": "Signer",
                    "user": {
                        "name": "Thiago Vitor de Faria Silva",
                        "identifier": "05256067699",
                        "email": "thiagov@previsa.com.br"
                    },
                    "allowElectronicSignature": false,
                    "prePositionedMarks": [
                        {
                            "type": "SignatureVisualRepresentation",
                            "uploadId": documentID,
                            "topLeftX": 50,
                            "topLeftY": 240,
                            "width": 200,
                            "pageNumber": pdfPageCount
                        },
                    ]
                },
                {
                    "type": "Signer",
                    "user": {
                        "name": "Lafayette Vilella de Moraes Neto",
                        "identifier": "62845888600",
                        "email": "lafayette@previsa.com.br"
                    },
                    "allowElectronicSignature": false,
                    "prePositionedMarks": [
                        {
                            "type": "SignatureVisualRepresentation",
                            "uploadId": documentID,
                            "topLeftX": 50,
                            "topLeftY": 375,
                            "width": 200,
                            "pageNumber": pdfPageCount
                        },
                    ]
                },
            ]
        });
        signerLogger.info(`CONTRATO - ${clientName} - ${proposeId} criado.`)
    } catch (error) {
        signerLogger.error(error)
        console.log(error);
    }
}