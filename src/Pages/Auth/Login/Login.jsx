import logo from "../../../assets/Container.png"
import { Link } from "react-router-dom"
import background from "../../../assets/image.png"
import styles from "./login.module.css"
import api from "../../../api/axios"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// setup useForm and useState

export default function Login() {
    const { register, handleSubmit, formState: {errors} } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit"
    })
    const [error, setError] = useState(null)
    
    const handleLogin = async (data) => {
        try {
            const response = await api.post("/auth/login", data)    
            console.log(response.data)
            if(!response.data.token) {
                setError(response.data.msg)
                return
            }

            localStorage.setItem("token", response.data.token)
            alert(response.data.msg)
        } catch (err) { 
            setError(err.response.data.msg || "Unable to connect to the server") 
        }
    }
    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, 5000);
    }, [error])
    return (
        <div id={styles.container} className="flex items-center justify-center min-h-dvh" style={{backgroundImage: `url(${background})`, backgroundSize: "contain"}}>
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#1E2025] p-7 place-items-center w-full max-w-100">
                <Link to="/">
                    <div className="flex shrink-0 w-fit items-center bg-[#ADC6FF] p-2 rounded ">
                        <img
                        alt="Your Company"
                        src={logo}
                        className="h-6 w-auto"
                        />
                    </div>
                </Link>
                <h2>System Atlas</h2>
                <span className="text-sm mb-5">Master Your Architectural Complexity</span>

                {error && <span className="text-sm text-red-500">{error}</span>}
                <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit(handleLogin)}>
                    <div className="flex flex-col gap-5">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="email" >Email Address</label>
                        <input 
                            className="p-3 bg-[#18181B] rounded-sm focus:outline-none" 
                            id="email" 
                            type="text" 
                            placeholder="example@email.com" 
                            {...register("email", 
                                {
                                    required: "Please Enter your Email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })
                            }
                        />
                        {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-1 flex-col gap-5">
                        <div>
                            <label className="font-(family-name:--labels) text-xs text-white" htmlFor="password" >Password</label>
                            <Link to="/" className="text-sm text-(--primary) hover:text-(--primary)/80 float-right" >Forgot Password?</Link>
                        </div>
                        <input 
                            className="w-full p-3 bg-[#18181B] rounded-sm focus:outline-none"
                            id="password" 
                            type="password" 
                            defaultValue="password" 
                            placeholder="Enter Your Password" 
                            {...register("password", 
                                {
                                    required: "Please Enter Your Password",
                                }
                            )}
                            />
                            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                    </div>
                    <button className="bg-[#2a60dd] p-3 rounded-md text-white font-semibold hover:bg-[#2a60dd]/80 mt-3" type="submit">Login</button>
                </form>
                <div className="flex flex-col gap-3 mt-5 w-full items-center justify-center border border-[#27272A] rounded-md " ></div>
                <span className="text-sm text-white">New to system Atlas? <Link to="/signup" className="text-(--primary) hover:text-(--primary)/80">Sign up</Link></span>
            </div>
        </div>
    )
}