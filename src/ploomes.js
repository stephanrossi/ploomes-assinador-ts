import download from "download";
import pdf from 'pdf-page-counter'
import path from 'path'

import api from './api/ploomes.js'

export async function getPersonID(quote) {

    const getPersonID = await api.get(`/Quotes?$filter=Id+eq+${quote}`)

    let personID = getPersonID.data.value[0].PersonId

    return personID
}

export async function getPersonData(quote) {

    let personData = []
    let personID = await getPersonID(quote)

    const getPersonData = await api.get(`/Contacts?$filter=Id+eq+${personID}`)

    let personName = getPersonData.data.value[0].Name
    let personCPF = getPersonData.data.value[0].CPF
    let personEmail = getPersonData.data.value[0].Email

    personData.push(personName, personCPF, personEmail)

    return personData
}

export async function getQuoteDoc(quote) {

    let quoteInfo = []

    const getQuoteInfo = await api.get(`/Quotes?$filter=Id+eq+${quote}`)

    let quoteDocURL = await getQuoteInfo.data.value[0].DocumentUrl

    await download(quoteDocURL, 'assets/files/quotes', {
        filename: `${quote}.pdf`
    })

    let downloadLocation = String(`/assets/files/quotes/${quote}.pdf`)

    let pdfPageCount = ''


    try {
        let __dirname = path.resolve();

        let getPdfPages = await pdf(path.join(__dirname, downloadLocation))
        pdfPageCount = getPdfPages.numpages

    } catch (error) {
        console.log(error);
    }

    quoteInfo.push(downloadLocation, pdfPageCount)

    return quoteInfo

}