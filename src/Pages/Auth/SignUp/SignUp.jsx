import logo from "../../../assets/Container.png"
import { Link } from "react-router-dom"
import background from "../../../assets/image.png"
import styles from "./signup.module.css"
import api from "../../../api/axios"
import { useForm } from "react-hook-form"



export default function SignUp() {
    const { register, handleSubmit, getValues, formState: {errors}} = useForm({
        mode: "onSubmit",
    })

    const handleSignUp = async (data) => {
        try {
            const response = await api.post("/auth/register", data)    
            console.log(response.data)
            alert(response.data.msg)
        } catch (err) { 
           console.log(err.response)
        }
    }

    return (
        <div id={styles.container} className="flex items-center justify-center min-h-dvh" style={{backgroundImage: `url(${background})`, backgroundSize: "contain"}} >
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#1E2025] p-7 place-items-center w-full max-w-120">
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


                <form className="flex flex-col gap-7 w-full" onSubmit={handleSubmit(handleSignUp)}>
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="frstName" >First Name</label>
                        <input 
                            className="p-3 bg-[#18181B] rounded-sm focus:outline-none" 
                            id="frstName"
                            type="text" 
                            placeholder="Enter Your First Name" 
                            {...register("firstName", {
                                required: "Please Enter Your first Name",
                            })}
                            />
                        {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="lstName" >Last Name</label>
                        <input 
                            className="p-3 bg-[#18181B] rounded-sm focus:outline-none"
                            id="lstName"
                            name="lastName"
                            type="text"
                            placeholder="Enter Your Last Name" 
                            {...register("lastName", {
                                required: "Please Enter Your last Name",
                            })}
                        />
                        {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}

                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="email" >Email Address</label>
                        <input 
                            className="p-3 bg-[#18181B] rounded-sm focus:outline-none"
                            id="email"
                            name="email"
                            type="text"
                            placeholder="example@email.com" 
                            {...register("email", {
                                required: "Please Enter Your last Name",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="font-(family-name:--labels) text-xs text-white" htmlFor="password" >Password</label>
                            <input 
                                className="w-full p-3 bg-[#18181B] rounded-sm focus:outline-none"
                                id="password"
                                name="password"
                                type="password"
                                defaultValue="password"
                                placeholder="Enter Your Password"
                                {...register("password", {
                                    required: "Please Enter a Password",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
                                        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
                                    }
                                })}
                                />
                        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                        </div>
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="font-(family-name:--labels) text-xs text-white" htmlFor="confirmPass" >Confirm Password</label>
                            <input className="w-full p-3 bg-[#18181B] rounded-sm focus:outline-none"
                            id="confirmPass"
                            type="password"
                            defaultValue="password"
                            placeholder="Re-enter Your Password" 
                            {...register("confirmPassword", {
                                required: "Please Re-Enter your Password",
                                validate: (value) => value ===  getValues("password")|| "Passwords do not match",
                            })}
                            />
                            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>
                    <button className="bg-[#2a60dd] p-3 rounded-md text-white font-semibold hover:bg-[#2a60dd]/80 mt-3" type="submit">Create Account</button>
                </form>
                <span className="text-sm text-white">Already have an account? <Link to="/login" className="text-(--primary) hover:text-(--primary)/80">Login</Link></span>
            </div>
        </div>
    )
}