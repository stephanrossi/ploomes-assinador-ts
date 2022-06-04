import axios from "axios";

const api = axios.create({
    baseURL: 'https://assinador.previsa.com.br/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'Previsa|a33d69efb170fc43a6b45d96ab6d79b56ad5089181725250512a51fbe7e8b52b'
    }
})

export default api