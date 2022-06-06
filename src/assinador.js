import * as Ploomes from './ploomes.js'
import pdf2base64 from 'pdf-to-base64'
import path from 'path'
import api from './api/index.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getQuoteHash(quote) {
    let getQuote = await Ploomes.getQuoteDoc(quote)
    let hash = ''

    try {
        hash = await pdf2base64(path.join(__dirname, '..', getQuote))
    } catch (error) {
        console.log(error);
    }

    return hash

}

export async function uploadHash(quote) {
    let hash = await getQuoteHash(quote)

    let postHash = await api.post('/uploads/bytes', {
        "bytes": hash
    })

    let documentID = postHash.data.id

    return documentID

}

export async function createDocument(quote) {
    let documentID = await uploadHash(quote)

    let personData = await Ploomes.getPersonData(quote);

    let personName = personData[0];
    let personCPF = personData[1]
    let personEmail = personData[2]

    let createDoc = await api.post('/documents', {
        "files": [
            {
                "displayName": "Stephan - Teste automação1",
                "id": documentID,
                "name": "Contrato.pdf",
                "contentType": "application/pdf"
            }
        ],
        // "notifiedEmails": ["cleiciamonteiro@previsa.com.br"],
        "flowActions": [
            {
                "type": "Signer",
                "user": {
                    "name": "stephan",
                    "identifier": "05976325610",
                    "email": "stephan@previsa.com.br"
                },
                "allowElectronicSignature": true,
                "prePositionedMarks": [
                    {
                        "type": "SignatureVisualRepresentation",
                        "uploadId": documentID,
                        "topLeftX": 50,
                        "topLeftY": 240,
                        "width": 150,
                        // "height": 5,
                        "pageNumber": 11
                    },
                    {
                        "type": "SignatureInitials",
                        "uploadId": documentID,
                        "topLeftX": 50,
                        "topLeftY": 375,
                        "width": 150,
                        // "height": 5,
                        "pageNumber": 11
                    },
                    {
                        "type": "SignatureInitials",
                        "uploadId": documentID,
                        "topLeftX": 150,
                        "topLeftY": 660,
                        "width": 150,
                        // "height": 5,
                        "pageNumber": 11
                    },
                ]
            },
        ]
    });


    // console.log(createDoc);
}

createDocument(3432071)
// {
            //     "type": "Signer",
            //     "user": {
            //         "name": "Thiago Vitor de Faria Silva",
            //         "identifier": "05256067699",
            //         "email": "thiagov@previsa.com.br"
            //     },
            // "allowElectronicSignature": false,

            // },
            // {
            //     "type": "Signer",
            //     "user": {
            //         "name": "Lafayette Vilella de Moraes Neto",
            //         "identifier": "62845888600",
            //         "email": "lafayette@previsa.com.br"
            //     },
            // "allowElectronicSignature": false,

            // },