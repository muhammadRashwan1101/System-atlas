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
        let isMounted = true;
        api.get("/auth/current-user")
            .then((res) => {
                if (isMounted) setUser(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [])

    return (
        <AuthContext.Provider value={{user, loading, setUser, getCurrentUser}}>
            {children}
        </AuthContext.Provider>
    )
}
