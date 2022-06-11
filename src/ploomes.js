import download from "download";
import pdf from 'pdf-page-counter'
import path from 'path'
import fs from 'fs'

import { apiPloomes } from "./api/index.js";
import { ploomesLogger } from "./logger.js";
import { sendingEmail } from "./sendMail.js";

export async function getPersonID(quote) {

    try {
        const getPersonID = await apiPloomes.get(`/Quotes?$filter=Id+eq+${quote}`)

        let personID = getPersonID.data.value[0].PersonId

        return personID
    } catch (error) {
        ploomesLogger.error(`getPersonID: ${error}`)
        return false;
    }
}

export async function getPersonData(quote) {

    let personData = []

    let personID = await getPersonID(quote)

    try {
        const getPersonData = await apiPloomes.get(`/Contacts?$filter=Id+eq+${personID}`)

        let personName = getPersonData.data.value[0].Name
        let personCPF = getPersonData.data.value[0].CPF
        let personEmail = getPersonData.data.value[0].Email

        if (personCPF == null || '' || undefined) {
            await sendingEmail(personName)
            ploomesLogger.error(`CPF is missing on quote ${quote}`)
            return false;
        }

        if (personEmail == null || '' || undefined) {
            ploomesLogger.error(`E-mail is missing on quote ${quote}`)
            return false;
        }

        personData.push(personName, personCPF, personEmail)

        return personData
    } catch (error) {
        ploomesLogger.error(`getPersonData: ${error}`)
        return false;
    }
}

export async function getQuoteDoc(quote) {

    let quoteInfo = []

    try {
        const getQuoteInfo = await apiPloomes.get(`/Quotes?$filter=Id+eq+${quote}`)

        let quoteDocURL = getQuoteInfo.data.value[0].DocumentUrl

        try {
            await download(quoteDocURL, 'assets/files/quotes', {
                filename: `${quote}.pdf`
            })
        } catch (error) {
            ploomesLogger.error(`download: ${error}`)
        }

        let downloadLocation = String(`/assets/files/quotes/${quote}.pdf`)

        let pdfPagesNumber = ''

        let __dirname = path.resolve();

        let pdfRead = fs.readFileSync(path.join(__dirname, downloadLocation))

        let getPdfPages = await pdf(pdfRead)

        pdfPagesNumber = getPdfPages.numpages

        quoteInfo.push(downloadLocation, pdfPagesNumber)

        return quoteInfo

    } catch (error) {
        ploomesLogger.error(`getQuoteDoc: ${error}`)
        return false;
    }
}