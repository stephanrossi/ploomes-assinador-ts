import axios from "axios";
import 'dotenv/config'

const api = axios.create({
    baseURL: 'https://api2.ploomes.com/',
    headers: {
        'Content-Type': 'application/json',
        'user-key': process.env.PLOOMES_KEY
    }
})

export default api