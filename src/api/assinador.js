import axios from "axios";
import 'dotenv/config'

export const apiSigner = axios.create({
    baseURL: 'https://assinador.previsa.com.br/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SIGNER_KEY
    }
})