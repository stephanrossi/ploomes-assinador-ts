"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuoteDoc = exports.getPersonData = exports.getPersonID = void 0;
const download_1 = __importDefault(require("download"));
const pdf_page_counter_1 = __importDefault(require("pdf-page-counter"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_js_1 = require("./api/index.js");
const logger_js_1 = require("./helpers/logger.js");
const sendMail_js_1 = require("./helpers/sendMail.js");
async function getPersonID(quote) {
    try {
        const getPersonID = await index_js_1.apiPloomes.get(`/Quotes?$filter=Id+eq+${quote}`);
        let personID = getPersonID.data.value[0].PersonId;
        return personID;
    }
    catch (error) {
        logger_js_1.ploomesLogger.error(`getPersonID: ${error}`);
        return false;
    }
}
exports.getPersonID = getPersonID;
async function getPersonData(quote) {
    let personData = [];
    let personID = await getPersonID(quote);
    try {
        const getPersonData = await index_js_1.apiPloomes.get(`/Contacts?$filter=Id+eq+${personID}`);
        let personName = getPersonData.data.value[0].Name;
        if (personName == null || personName == '' || personName == undefined) {
            await (0, sendMail_js_1.sendingEmail)(personName);
            logger_js_1.ploomesLogger.error(`Name is missing on quote ${quote}`);
            return false;
        }
        let personCPF = getPersonData.data.value[0].CPF;
        if (personCPF == null || personCPF == '' || personCPF == undefined) {
            await (0, sendMail_js_1.sendingEmail)(personName);
            logger_js_1.ploomesLogger.error(`CPF is missing on quote ${quote}`);
            return false;
        }
        let personEmail = getPersonData.data.value[0].Email;
        if (personEmail == null || personEmail == '' || personEmail == undefined) {
            logger_js_1.ploomesLogger.error(`E-mail is missing on quote ${quote}`);
            return false;
        }
        personData.push(personName, personCPF, personEmail);
        return personData;
    }
    catch (error) {
        logger_js_1.ploomesLogger.error(`getPersonData: ${error}`);
        return false;
    }
}
exports.getPersonData = getPersonData;
async function getQuoteDoc(quote) {
    let quoteInfo = [];
    try {
        const getQuoteInfo = await index_js_1.apiPloomes.get(`/Quotes?$filter=Id+eq+${quote}`);
        let quoteDocURL = getQuoteInfo.data.value[0].DocumentUrl;
        try {
            await (0, download_1.default)(quoteDocURL, 'assets/files/quotes', {
                filename: `${quote}.pdf`
            });
        }
        catch (error) {
            logger_js_1.ploomesLogger.error(`download: ${error}`);
        }
        let downloadLocation = String(`/assets/files/quotes/${quote}.pdf`);
        let pdfPagesNumber = '';
        let __dirname = path_1.default.resolve();
        let pdfRead = fs_1.default.readFileSync(path_1.default.join(__dirname, downloadLocation));
        let getPdfPages = await (0, pdf_page_counter_1.default)(pdfRead);
        pdfPagesNumber = getPdfPages.numpages;
        quoteInfo.push(downloadLocation, pdfPagesNumber);
        return quoteInfo;
    }
    catch (error) {
        logger_js_1.ploomesLogger.error(`getQuoteDoc: ${error}`);
        return false;
    }
}
exports.getQuoteDoc = getQuoteDoc;
