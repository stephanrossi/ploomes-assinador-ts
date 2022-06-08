import axios from "axios";

const api = axios.create({
    baseURL: 'https://api2.ploomes.com/',
    headers: {
        'Content-Type': 'application/json',
        'user-key': '92E7EE557BC80E4E5219120F3A5B3B24F68056942B23AA57B95AA4DD03C589EADBCA3F9A75A6E2D3ECFECA25274F7991E27487FAAE8D8C6D84687C71C1693368'
    }
})

export default api