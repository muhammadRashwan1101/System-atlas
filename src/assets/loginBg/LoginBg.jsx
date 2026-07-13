import loginVideo from "./login-bg.mp4"
export default function LoginBg() {
    return (
        <div>
            <video loop autoPlay muted id="bg-video">
                <source src={loginVideo} type="video/mp4" />
            </video>
        </div>
    )
}