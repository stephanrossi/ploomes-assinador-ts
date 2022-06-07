import fetch from "node-fetch";
import download from "download";
import pdf from 'pdf-page-counter'
import path from 'path'

const BASEURL = "https://api2.ploomes.com/"

export async function getPersonID(quote) {
    const get = await fetch(BASEURL + `Quotes?$filter=Id+eq+${quote}`,
        {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'user-key': '92E7EE557BC80E4E5219120F3A5B3B24F68056942B23AA57B95AA4DD03C589EADBCA3F9A75A6E2D3ECFECA25274F7991E27487FAAE8D8C6D84687C71C1693368'
            }
        }
    )
    const response = await get.json()

    let personID = await response.value[0].PersonId

    return personID
}

export async function getPersonData(quote) {

    let personData = []
    let personID = await getPersonID(quote)

    const get = await fetch(BASEURL + `Contacts?$filter=Id+eq+${personID}`,
        {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'user-key': '92E7EE557BC80E4E5219120F3A5B3B24F68056942B23AA57B95AA4DD03C589EADBCA3F9A75A6E2D3ECFECA25274F7991E27487FAAE8D8C6D84687C71C1693368'
            }
        }
    )

    const response = await get.json()

    let personName = response.value[0].Name
    let personCPF = response.value[0].CPF
    let personEmail = response.value[0].Email

    personData.push(personName, personCPF, personEmail)

    return personData
}

export async function getQuoteDoc(quote) {

    let quoteInfo = []

    const get = await fetch(BASEURL + `Quotes?$filter=Id+eq+${quote}`,
        {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'user-key': '92E7EE557BC80E4E5219120F3A5B3B24F68056942B23AA57B95AA4DD03C589EADBCA3F9A75A6E2D3ECFECA25274F7991E27487FAAE8D8C6D84687C71C1693368'
            }
        }
    )
    const response = await get.json()

    let quoteDocURL = await response.value[0].DocumentUrl

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

getQuoteDoc(3432071)