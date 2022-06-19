import * as Ploomes from './ploomes.js'
import pdf2base64 from 'pdf-to-base64'
import path from 'path'

import { apiSigner } from './api/index.js'
import { signerLogger } from './helpers/logger.js'

import { QuoteType, QuoteTypeInfo } from './ploomes.js'

export async function getQuoteHash(quote: QuoteType): Promise<QuoteTypeInfo> {

    try {
        let getQuoteInfo = await Ploomes.getQuoteDoc(quote)
        let getQuote = getQuoteInfo[0 as keyof typeof getQuoteInfo];
        let pdfPageCount = getQuoteInfo[1 as keyof typeof getQuoteInfo];

        let quoteParams = []

        let hash = ''

        let __dirname = path.resolve();

        hash = await pdf2base64(path.join(__dirname, getQuote))

        quoteParams.push(hash, pdfPageCount)

        return quoteParams
    } catch (error) {
        signerLogger.error(`getQuoteHash: ${error}`)
        return false;
    }
}

export async function uploadHash(quote: QuoteType): Promise<QuoteTypeInfo | number[]> {

    try {
        let hashInfo = []

        let getHash = await getQuoteHash(quote)

        let hash = getHash[0 as keyof typeof getHash]
        let pdfPageCount: number = getHash[1 as keyof typeof getHash]

        let postHash = await apiSigner.post('/uploads/bytes', {
            "bytes": hash
        })

        let documentID: number = postHash.data.id

        hashInfo.push(documentID, pdfPageCount)

        return hashInfo
    } catch (error) {
        signerLogger.error(`uploadHash: ${error}`)
        return false;
    }
}

export async function createDocument(quote: QuoteType, clientName: string, proposeId: number) {
    try {

        let getDocInfo = await uploadHash(quote)
        let documentID = getDocInfo[0 as keyof typeof getDocInfo]
        let pdfPageCount = getDocInfo[1 as keyof typeof getDocInfo]

        let personData = await Ploomes.getPersonData(quote);

        let personName = personData[0 as keyof typeof personData];
        let personCPF = personData[1 as keyof typeof personData]
        let personEmail = personData[2 as keyof typeof personData]

        await apiSigner.post('/documents', {
            "files": [
                {
                    "displayName": `CONTRATO - ${clientName} - ${proposeId}`,
                    "id": documentID,
                    "name": `CONTRATO - ${clientName}.pdf`,
                    "contentType": "application/pdf"
                }
            ],
            // "notifiedEmails": ["cleiciamonteiro@previsa.com.br"],
            "flowActions": [
                {
                    "type": "Signer",
                    "user": {
                        "name": "stephan rossi",
                        "identifier": "05976325610",
                        "email": "stephan@previsa.com.br"
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
                // {
                //     "type": "Signer",
                //     "user": {
                //         "name": "Thiago Vitor de Faria Silva",
                //         "identifier": "05256067699",
                //         "email": "thiagov@previsa.com.br"
                //     },
                //     "allowElectronicSignature": false,
                //     "prePositionedMarks": [
                //         {
                //             "type": "SignatureVisualRepresentation",
                //             "uploadId": documentID,
                //             "topLeftX": 50,
                //             "topLeftY": 240,
                //             "width": 200,
                //             "pageNumber": pdfPageCount
                //         },
                //     ]
                // },
                // {
                //     "type": "Signer",
                //     "user": {
                //         "name": "Lafayette Vilella de Moraes Neto",
                //         "identifier": "62845888600",
                //         "email": "lafayette@previsa.com.br"
                //     },
                //     "allowElectronicSignature": false,
                //     "prePositionedMarks": [
                //         {
                //             "type": "SignatureVisualRepresentation",
                //             "uploadId": documentID,
                //             "topLeftX": 50,
                //             "topLeftY": 375,
                //             "width": 200,
                //             "pageNumber": pdfPageCount
                //         },
                //     ]
                // },
            ],
        });
        signerLogger.info(`CONTRATO - ${clientName} - ${proposeId} criado.`)
    } catch (error) {
        signerLogger.error(`createDocument: ${error}`)
        return false;
    }
}