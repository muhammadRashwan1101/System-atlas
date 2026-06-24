import logo from "../../../assets/Container.png"
import { Link } from "react-router-dom"
import background from "../../../assets/image.png"
import styles from "./signup.module.css"
import api from "../../../api/axios"
import { useForm } from "react-hook-form"

// use useForm to validate the data 
// Get input value
// Submit values to the api 


export default function SignUp() {
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
                <form className="flex flex-col gap-7 w-full">
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="frstName" >First Name</label>
                        <input className="p-3 bg-[#18181B] rounded-sm focus:outline-none" id="frstName" name="firstName" type="text" placeholder="Enter Your First Name" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="lstName" >Last Name</label>
                        <input className="p-3 bg-[#18181B] rounded-sm focus:outline-none" id="lstName" name="lastName" type="text" placeholder="Enter Your Last Name" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="font-(family-name:--labels) text-xs text-white" htmlFor="email" >Email Address</label>
                        <input className="p-3 bg-[#18181B] rounded-sm focus:outline-none" id="email" name="email" type="text" placeholder="example@email.com" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="font-(family-name:--labels) text-xs text-white" htmlFor="password" >Password</label>
                            <input className="w-full p-3 bg-[#18181B] rounded-sm focus:outline-none" id="password" name="password" type="password" defaultValue="password" placeholder="Enter Your Password" />
                        </div>
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="font-(family-name:--labels) text-xs text-white" htmlFor="confirmPass" >Confirm Password</label>
                            <input className="w-full p-3 bg-[#18181B] rounded-sm focus:outline-none" id="confirmPass" name="ConfirmPassword" type="password" defaultValue="password" placeholder="Re-enter Your Password" />
                        </div>
                    </div>
                    <button className="bg-[#2a60dd] p-3 rounded-md text-white font-semibold hover:bg-[#2a60dd]/80 mt-3" type="submit">Create Account</button>
                </form>
                <span className="text-sm text-white">Already have an account? <Link to="/login" className="text-(--primary) hover:text-(--primary)/80">Login</Link></span>
            </div>
        </div>
    )
}