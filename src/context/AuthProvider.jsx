import {useState, useEffect} from "react"
import api from "../api/axios"
import {AuthContext} from "./AuthContext"

export default function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const getCurrentUser = async () => {
        try {
        const currenUser = await api.get("/auth/current-user")
            setUser(currenUser.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    } 
    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <AuthContext.Provider value={{user, loading, setUser, getCurrentUser}}>
            {children}
        </AuthContext.Provider>
    )
}
