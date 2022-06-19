"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = exports.uploadHash = exports.getQuoteHash = void 0;
const Ploomes = __importStar(require("./ploomes.js"));
const pdf_to_base64_1 = __importDefault(require("pdf-to-base64"));
const path_1 = __importDefault(require("path"));
const index_js_1 = require("./api/index.js");
const logger_js_1 = require("./helpers/logger.js");
async function getQuoteHash(quote) {
    try {
        let getQuoteInfo = await Ploomes.getQuoteDoc(quote);
        let getQuote = getQuoteInfo[0];
        let pdfPageCount = getQuoteInfo[1];
        let quoteParams = [];
        let hash = '';
        let __dirname = path_1.default.resolve();
        hash = await (0, pdf_to_base64_1.default)(path_1.default.join(__dirname, getQuote));
        quoteParams.push(hash, pdfPageCount);
        return quoteParams;
    }
    catch (error) {
        logger_js_1.signerLogger.error(`getQuoteHash: ${error}`);
        return false;
    }
}
exports.getQuoteHash = getQuoteHash;
async function uploadHash(quote) {
    try {
        let hashInfo = [];
        let getHash = await getQuoteHash(quote);
        let hash = getHash[0];
        let pdfPageCount = getHash[1];
        let postHash = await index_js_1.apiSigner.post('/uploads/bytes', {
            "bytes": hash
        });
        let documentID = postHash.data.id;
        hashInfo.push(documentID, pdfPageCount);
        return hashInfo;
    }
    catch (error) {
        logger_js_1.signerLogger.error(`uploadHash: ${error}`);
        return false;
    }
}
exports.uploadHash = uploadHash;
async function createDocument(quote, clientName, proposeId) {
    try {
        let getDocInfo = await uploadHash(quote);
        let documentID = getDocInfo[0];
        let pdfPageCount = getDocInfo[1];
        let personData = await Ploomes.getPersonData(quote);
        let personName = personData[0];
        let personCPF = personData[1];
        let personEmail = personData[2];
        await index_js_1.apiSigner.post('/documents', {
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
        logger_js_1.signerLogger.info(`CONTRATO - ${clientName} - ${proposeId} criado.`);
    }
    catch (error) {
        logger_js_1.signerLogger.error(`createDocument: ${error}`);
        return false;
    }
}
exports.createDocument = createDocument;
