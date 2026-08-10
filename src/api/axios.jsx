import axios from "axios"

export const SERVER_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: `${SERVER_URL}/api`,
})

api.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    if(token) {
        req.headers.authorization = `Bearer ${token}`
    } else {
        delete req.headers.authorization
    }
    return req
})

export default api
