import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api",
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