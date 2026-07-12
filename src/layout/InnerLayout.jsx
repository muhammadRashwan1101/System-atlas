import Sidebar from "../components/Sidebar/Sidebar"
import { Outlet } from "react-router-dom"

export default function InnerLayout () {
    return <>
    <div className="flex w-full min-h-screen">
        <Sidebar />
        <Outlet />
    </div>
    </>

}